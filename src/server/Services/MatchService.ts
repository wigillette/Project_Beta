import { KnitServer as Knit, RemoteSignal, Service } from "@rbxts/knit";
import { ReplicatedStorage, Workspace, Teams, Players } from "@rbxts/services";
import { RESERVED_TEAMS } from "server/Utils/ReservedTeams";
import SnackbarService from "./SnackbarService";
import MusicService from "./MusicService";
import FFA from "../GameModes/FFA";
import TDM from "../GameModes/TDM";
import Teamswap from "server/GameModes/Teamswap";
import Streak from "server/GameModes/Streak";
import Ghosts from "server/GameModes/Ghosts";
import Juggernaut from "server/GameModes/Juggernaut";
import PTL from "server/GameModes/PTL";
import SFT from "server/GameModes/SFT";
import { GoldService } from "./GoldService";
import { ProfileService } from "./ProfileService";
import { BettingService } from "./BettingService";
import { VotingService } from "./VotingService";
import { EquippedFormat } from "shared/InventoryInfo";
import { modeObjectives, modes } from "shared/GameInfo";
import ObjectUtils from "@rbxts/object-utils";
import { leaderFormat } from "server/GameModes/PTL";
import { InventoryService } from "./InventoryService";
import { DEATH_FUNCTIONS } from "../Utils/DeathEffects";

interface playerResult {
	Player: Player;
	Kills: number;
	Deaths: number;
}
declare global {
	interface KnitServices {
		MatchService: typeof MatchService;
	}
}

const modelsFolder = ReplicatedStorage.WaitForChild("ModelsFolder");
const mapsFolder = ReplicatedStorage.WaitForChild("Maps");
const mapHolder = Workspace.WaitForChild("Holder");
const objectValues = ReplicatedStorage.WaitForChild("ObjectValues");
const timer = objectValues.WaitForChild("Timer") as IntValue;
const status = objectValues.WaitForChild("Status") as StringValue;

const MatchService = Knit.CreateService({
	Name: "MatchService",
	CurrentMode: "None",
	CurrentMap: "None",
	ModeLibraries: {
		FFA: FFA,
		TDM: TDM,
		Teamswap: Teamswap,
		Streak: Streak,
		Ghosts: Ghosts,
		Juggernaut: Juggernaut,
		PTL: PTL,
		SFT: SFT,
	},
	IntermissionTime: 45,
	VotingTime: 20,
	BettingTime: 20,
	Participants: new Map<Player, boolean>(),
	isIntermission: true,

	Client: {
		// Handles client-server communication; OnServerEvent
		InitialMatchPanel: new RemoteSignal<(modeName: string, mapName: string, aliveCounter: number) => void>(),
		HideMatchResults: new RemoteSignal<() => void>(),
		UpdateAliveCounter: new RemoteSignal<(aliveCounter: number) => void>(),
		PlayClientSound: new RemoteSignal<(swordName: string) => void>(),
		UpdateMatchResults: new RemoteSignal<
			(goldEarned: number, playerResults: playerResult[], winner: string) => void
		>(),
		CanAccess(Player: Player) {
			return this.Server.CanAccess(Player);
		},
	},

	// Push a notification to a single client
	PushResult(client: Player, goldEarned: number, playerResults: playerResult[], winner: string) {
		this.Client.UpdateMatchResults.Fire(client, goldEarned, playerResults, winner);
	},

	CanAccess(client: Player) {
		return [this.Participants.get(client), this.isIntermission];
	},

	UpdateMatchSettings(mapName: string, modeName: string) {
		this.CurrentMap = mapName;
		this.CurrentMode = modeName;
	},

	SetPlaying(player: Player, isPlaying: boolean) {
		if (this.Participants.get(player)) {
			this.Participants.set(player, isPlaying);
		}
	},

	ResetTeams() {
		Teams.GetChildren().forEach((team) => {
			if (team.IsA("Team") && !RESERVED_TEAMS.includes(team.TeamColor)) {
				team.Destroy();
			}
		});
	},

	RemoveWeapon(player: Player) {
		const character = player.Character;
		if (player && character) {
			const sword = character.FindFirstChildOfClass("Tool");
			const starterGear = player.WaitForChild("StarterGear", 10);
			if (sword) {
				sword.Destroy();
			}
			if (starterGear) {
				starterGear.ClearAllChildren();
			}
		}
	},

	ResetMatch(participants: Player[]) {
		this.UpdateMatchSettings("None", "None");
		// Place all the players from the match in the lobby

		participants.forEach((player) => {
			pcall(() => {
				this.RemoveWeapon(player);
				player.TeamColor = new BrickColor("White");
				player.LoadCharacter();
			});
		});
		this.ResetTeams();
		if (mapHolder) {
			mapHolder.ClearAllChildren();
		}
		// Restart the lobby stuff
		MusicService.ChangeMusic(participants, "Lobby");
		this.Client.InitialMatchPanel.FireAll(this.CurrentMode, this.CurrentMap, 0);
	},

	DisplayResults(winner: Player | string, playingList: Player[], winningTeam: Player[]) {
		const playerResults: playerResult[] = [];
		// Fetch the leaderboard results
		const participants = playingList;
		participants.forEach((player) => {
			if (player) {
				const leaderstats = player.FindFirstChild("leaderstats");
				if (leaderstats) {
					const kills = leaderstats.FindFirstChild("Kills") as IntValue;
					const deaths = leaderstats.FindFirstChild("Deaths") as IntValue;
					if (kills && deaths) {
						playerResults.push({ Player: player, Kills: kills.Value, Deaths: deaths.Value });
					}
				}
			}
		});

		// Add the experience and gold for each player
		participants.forEach((player) => {
			if (player) {
				const leaderstats = player.FindFirstChild("leaderstats");
				if (leaderstats) {
					const kills = leaderstats.FindFirstChild("Kills") as IntValue;
					const deaths = leaderstats.FindFirstChild("Deaths") as IntValue;
					if (kills && deaths) {
						// Need to keep track of teams a new way?
						const isWinner = winner === player || winningTeam.includes(player);
						const expEarned = math.max(kills.Value * 50 - deaths.Value * 25 + ((isWinner && 100) || 0), 0);
						const goldEarned = (isWinner && 50) || 10;
						GoldService.AddGold(player, goldEarned);
						ProfileService.IncrementExp(player, expEarned);
						let winnerName = "Error";

						if (typeIs(winner, "Player")) {
							winnerName = winner.Name;
						} else {
							winnerName = winner as string;
						}
						this.PushResult(player, goldEarned, playerResults, winnerName);
						// Reset kills and deaths
						kills.Value = 0;
						deaths.Value = 0;
					}
				}
			}
		});

		// Award for bets
		BettingService.AwardBets(winner);
	},

	GiveWeapon(player: Player, isAntiTK: boolean) {
		const inventoryService = Knit.GetService("InventoryService");
		const playerEquipped: EquippedFormat = inventoryService.FetchEquipped(player);
		if (playerEquipped) {
			const sword = playerEquipped.Swords;
			if (sword !== undefined) {
				const swordsFolder = ReplicatedStorage.WaitForChild("ModelsFolder", 10);
				if (swordsFolder) {
					const swordTool = swordsFolder.FindFirstChild(sword);
					if (swordTool) {
						const swordClone = swordTool.Clone();
						const handle = swordClone.FindFirstChild("Handle");
						if (handle) {
							const swordSettings = handle.FindFirstChild("Settings");
							if (swordSettings) {
								const antiTK = swordSettings.FindFirstChild("Anti TK") as BoolValue;
								if (antiTK) {
									antiTK.Value = isAntiTK;
								}
							}
						}
						swordClone.Parent = player.WaitForChild("StarterGear", 10);
					}
				}
			}
		}
	},

	StartTimer(
		timeLimit: number,
		teams: Team[],
		callback: (aliveCounter: number) => Player | string | undefined,
		participants: Player[],
		leaders?: leaderFormat,
	) {
		timer.Value = timeLimit;
		let playersAlive = true;
		let formerAliveCounter = 0;
		let aliveCounter = 0;

		while (
			timer.Value > 0 &&
			((leaders &&
				leaders.Blue &&
				leaders.Red &&
				leaders.Red.TeamColor !== new BrickColor("White") &&
				leaders.Blue.TeamColor !== new BrickColor("White")) ||
				(!leaders && (playersAlive || aliveCounter > 1)))
		) {
			aliveCounter = 0;
			teams.forEach((team: Team) => {
				if (playersAlive && team) {
					aliveCounter += team.GetPlayers().size();
					playersAlive = team.GetPlayers().size() > 0;
				}
			});
			if (formerAliveCounter !== aliveCounter) {
				// Update the alive counter
				formerAliveCounter = aliveCounter;
				this.Client.UpdateAliveCounter.FireAll(aliveCounter);
			}
			timer.Value -= 1;
			wait(1);
		}
		const winner = callback(aliveCounter);
		let winningTeam: Player[] = [];
		if (typeOf(winner) === "string") {
			const team = Teams.FindFirstChild(winner as string) as Team;
			if (team) {
				winningTeam = team.GetPlayers();
			}
		}
		this.ResetMatch(participants);
		if (winner !== undefined) {
			this.DisplayResults(winner, participants, winningTeam);
		}
	},

	CreateTeams(teamsList: BrickColor[], teamNames: string[]) {
		const teams: Team[] = [];
		ObjectUtils.entries(teamsList).forEach((color) => {
			const team = new Instance("Team");
			team.Name = teamNames[color[0] - 1];
			team.TeamColor = color[1];
			team.Parent = Teams;
			teams.push(team);
		});

		return teams;
	},

	LoadMatch(participants: Player[]) {
		if (this.CurrentMap !== "None" && this.CurrentMode !== "None" && mapsFolder) {
			const currentMap = mapsFolder.FindFirstChild(this.CurrentMap);

			if (currentMap && mapHolder) {
				currentMap.Clone().Parent = mapHolder; // Clone the new map into the folder
				if (this.CurrentMode in this.ModeLibraries) {
					const modeLibraries = this.ModeLibraries; // for some reason it was bugging when i put this.ModeLibraries below lol
					const library = modeLibraries[this.CurrentMode as keyof typeof modeLibraries];
					const teams = this.CreateTeams(library.TEAMS, library.TEAM_NAMES); // Create the teams
					this.Client.InitialMatchPanel.FireAll(this.CurrentMode, this.CurrentMap, participants.size());
					MusicService.ChangeMusic(participants, "Match");
					library.init(teams, participants); // execute the init function of the mode
				} else {
					SnackbarService.PushAll("Unable to locate mode module..");
				}
			} else {
				SnackbarService.PushAll("Error with loading the map..");
			}
		} else {
			SnackbarService.PushAll("Error with loading the current round..");
		}
	},

	ChooseMap() {
		const maps = mapsFolder?.GetChildren();
		let toReturn = "Beach";
		if (maps) {
			const randomMap = maps[math.floor(math.random() * maps.size())];
			toReturn = randomMap.Name;
		}
		return toReturn;
	},

	ChooseMode() {
		const randomMode = modes[math.floor(math.random() * modes.size())];
		return randomMode;
	},

	DecrementTimer() {
		if (timer) {
			while (timer.Value > 0) {
				timer.Value -= 1;
				wait(1);
			}
		}
	},

	GetParticipants() {
		const participantList = [] as Player[];
		ObjectUtils.entries(this.Participants).forEach((participant) => {
			if (participant[1]) {
				participantList.push(participant[0]);
			}
		});

		return participantList;
	},

	AddSword(player: Player) {
		const char = player.Character || player.CharacterAdded.Wait()[0];
		if (char) {
			const torso = char.FindFirstChild("Torso") as Part;
			const equipped = InventoryService.FetchEquipped(player);
			const backSword = char.FindFirstChild("BackSword");
			if (backSword) {
				backSword.Destroy();
			}
			if (equipped && torso) {
				const equippedSword = equipped.Swords;
				if (equippedSword !== undefined) {
					const swordModel = modelsFolder.FindFirstChild(equippedSword) as Tool;
					if (swordModel) {
						const model = new Instance("Model");
						model.Name = "BackSword";
						model.Parent = char;
						const handle = swordModel.FindFirstChild("Handle") as Part;
						if (handle) {
							const newHandle = handle.Clone();
							const swordScript = newHandle.FindFirstChild("SwordScript");
							if (swordScript) {
								swordScript.Destroy();
							}
							newHandle.CanCollide = false;
							newHandle.Parent = model;
							const attachment = new Instance("Attachment");
							attachment.Parent = torso;
							attachment.Position = new Vector3(0, 0, 0.6);

							const weld = new Instance("Weld");
							weld.Name = "BackWeld";
							weld.Part0 = torso;
							weld.Part1 = newHandle;
							weld.C0 = new CFrame(attachment.Position);
							weld.C0 = weld.C0.mul(CFrame.fromEulerAnglesXYZ(math.rad(90), math.rad(330), 0));
							weld.Parent = newHandle;
						}
					}
				}
			}
		}
	},

	// Initialize on service startup
	KnitInit() {
		print("Match Service Initialized | Server");

		Players.PlayerAdded.Connect((player: Player) => {
			// Leaderstats Stuff Below
			this.Participants.set(player, true);

			const leaderstats = new Instance("Folder");
			leaderstats.Name = "leaderstats";
			leaderstats.Parent = player;

			const kills = new Instance("IntValue");
			kills.Name = "Kills";
			kills.Value = 0;
			kills.Parent = leaderstats;

			const deaths = new Instance("IntValue");
			deaths.Name = "Deaths";
			deaths.Value = 0;
			deaths.Parent = leaderstats;

			this.AddSword(player);
			player.CharacterAdded.Connect((char: Model) => {
				wait(0.5);
				this.AddSword(player);
				const humanoid = char.FindFirstChildOfClass("Humanoid");

				// Add Sword on Back
				char.ChildAdded.Connect((child) => {
					const equipped = InventoryService.FetchEquipped(player);
					if (equipped) {
						const equippedSword = equipped.Swords;
						if (equippedSword !== undefined) {
							if (child.Name === equippedSword && child.IsA("Tool")) {
								const backSword = char.FindFirstChild("BackSword");
								if (player.Team && player.Team.Name !== "Ghosts" && backSword) {
									backSword.Destroy();
								}
							}
						}
					}
				});
				char.ChildRemoved.Connect((child) => {
					const equipped = InventoryService.FetchEquipped(player);
					if (equipped) {
						const equippedSword = equipped.Swords;
						if (equippedSword !== undefined) {
							if (child.Name === equippedSword && child.IsA("Tool")) {
								const backSword = char.FindFirstChild("BackSword");
								if (player.Team && player.Team.Name !== "Ghosts" && !backSword) {
									this.AddSword(player);
								}
							}
						}
					}
				});
				// Leaderboard Stuff
				if (humanoid) {
					humanoid.Died.Connect(() => {
						deaths.Value += 1;

						if (!RESERVED_TEAMS.includes(player.TeamColor) && this.CurrentMode !== "None") {
							const modeLibraries = this.ModeLibraries; // for some reason it was bugging when i put this.ModeLibraries below lol
							if (this.CurrentMode in modeLibraries) {
								const library = modeLibraries[this.CurrentMode as keyof typeof modeLibraries];
								if (deaths.Value >= library.OUTSCORE) {
									player.TeamColor = new BrickColor("White");
								}
							}
						}
						const tag = humanoid.FindFirstChild("creator") as ObjectValue;
						if (tag) {
							const killer = tag.Value as Player;
							if (killer) {
								const killerLS = killer.FindFirstChild("leaderstats");
								const killerEquipped = InventoryService.FetchEquipped(killer);
								if (killerEquipped) {
									const killerSword = killerEquipped.Swords;
									if (killerSword !== undefined && killerSword in DEATH_FUNCTIONS) {
										this.Client.PlayClientSound.Fire(player, killerSword);
										this.Client.PlayClientSound.Fire(killer, killerSword);
										coroutine.wrap(() => {
											DEATH_FUNCTIONS[killerSword as keyof typeof DEATH_FUNCTIONS](player);
										})();
									}
								}
								if (killerLS) {
									const killerKills = killerLS.FindFirstChild("Kills") as IntValue;
									if (killerKills) {
										killerKills.Value += 1;
									}
								}
							}
						}
					});
				}
			});
		});

		Players.PlayerRemoving.Connect((player) => {
			this.Participants.delete(player);
		});

		coroutine.wrap(() => {
			// Game Loop
			// Wait until there are less than two players
			while (Players.GetPlayers().size() === 0) {
				wait(0.05);
			}
			while (Players.GetPlayers().size() > 0) {
				if (this.GetParticipants().size() >= 2) {
					// Do the voting here
					this.isIntermission = true;
					status.Value = "Intermission..";
					timer.Value = this.IntermissionTime;
					this.DecrementTimer();
					this.isIntermission = false;
					const participants = this.GetParticipants();
					VotingService.SelectChosen(participants);
					// Display the voting page for all clients
					status.Value = "Map/Mode Voting..";
					timer.Value = this.VotingTime;
					this.DecrementTimer();
					// Close the voting page for all clients
					VotingService.Client.CloseVoting.FireAll();
					wait(1);

					// Total up the votes to get the map and mode
					const matchSelection = VotingService.TotalVotes();
					this.CurrentMap = matchSelection[0] || this.ChooseMap();
					this.CurrentMode = matchSelection[1] || this.ChooseMode();

					// Change this to a get participants function soon
					// Display the betting UI
					const modeLibraries = this.ModeLibraries;
					if (this.CurrentMode in modeLibraries) {
						const library = modeLibraries[this.CurrentMode as keyof typeof modeLibraries];

						BettingService.FetchBettingInfo(
							participants,
							((library.TEAMS.size() === 1 || this.CurrentMode === "SFT") && participants) ||
								library.TEAM_NAMES,
							this.CurrentMode,
						);
						// Update the panel for the betting time
						status.Value = "Winner Predictions..";
						timer.Value = this.BettingTime;
						this.DecrementTimer();
						BettingService.Client.CloseBetting.FireAll();
						wait(1);

						// Begin setting up the match
						if (this.CurrentMode in modeObjectives) {
							status.Value = modeObjectives[this.CurrentMode as keyof typeof modeObjectives];
						}
						this.LoadMatch(participants);
						spawn(() => {
							wait(25);
							this.Client.HideMatchResults.FireAll();
						});
					} else {
						SnackbarService.PushAll(`Unable to locate ${this.CurrentMode} module..`);
					}
				} else {
					wait(0.5);
					status.Value = "Need at least two players..";
				}
			}
		})();
	},
});

export = MatchService;
