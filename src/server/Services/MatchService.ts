import { KnitServer as Knit, RemoteSignal, Service } from "@rbxts/knit";
import { ReplicatedStorage, Workspace, Teams, Players } from "@rbxts/services";
import { RESERVED_TEAMS } from "server/Utils/ReservedTeams";
import SnackbarService from "./SnackbarService";
import FFA from "../GameModes/FFA";
import { GoldService } from "./GoldService";
import { ProfileService } from "./ProfileService";
import { BettingService } from "./BettingService";
import { VotingService } from "./VotingService";
import { EquippedFormat } from "shared/InventoryInfo";
import { modes } from "shared/GameInfo";

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

const mapsFolder = ReplicatedStorage.WaitForChild("Maps", 10);
const mapHolder = Workspace.WaitForChild("Holder", 10);

const MatchService = Knit.CreateService({
	Name: "MatchService",
	CurrentMode: "None",
	CurrentMap: "None",
	ModeLibraries: {
		FFA: FFA,
	},
	IntermissionTime: 5,
	VotingTime: 30,
	BettingTime: 30,

	Client: {
		// Handles client-server communication; OnServerEvent
		InitialMatchPanel: new RemoteSignal<
			(initialTime: number, modeName: string, mapName: string, aliveCounter: number) => void
		>(),
		UpdateAliveCounter: new RemoteSignal<(aliveCounter: number) => void>(),
		UpdateMatchResults: new RemoteSignal<(goldEarned: number, playerResults: playerResult[]) => void>(),
	},

	// Push a notification to a single client
	PushResult(client: Player, goldEarned: number, playerResults: playerResult[]) {
		this.Client.UpdateMatchResults.Fire(client, goldEarned, playerResults);
	},

	UpdateMatchSettings(mapName: string, modeName: string) {
		this.CurrentMap = mapName;
		this.CurrentMode = modeName;
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
			const starterGear = player.WaitForChild("StarterGear");
			if (sword) {
				sword.Destroy();
			}
			if (starterGear) {
				starterGear.ClearAllChildren();
			}
		}
	},

	ResetMatch() {
		this.UpdateMatchSettings("None", "None");
		// Place all the players from the match in the lobby

		Players.GetPlayers().forEach((player) => {
			if (!RESERVED_TEAMS.includes(player.TeamColor)) {
				pcall(() => {
					this.RemoveWeapon(player);
					player.TeamColor = new BrickColor("White");
					player.LoadCharacter();
				});
			}
		});
		this.ResetTeams();
		if (mapHolder) {
			mapHolder.ClearAllChildren();
		}
		// Restart the lobby stuff
		this.Client.InitialMatchPanel.FireAll(this.IntermissionTime, this.CurrentMode, this.CurrentMap, 0);
	},

	DisplayResults(winner: Player | string, playingList: Player[]) {
		const playerResults: playerResult[] = [];
		// Fetch the leaderboard results
		playingList.forEach((player) => {
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
		playingList.forEach((player) => {
			if (player) {
				const leaderstats = player.FindFirstChild("leaderstats");
				if (leaderstats) {
					const kills = leaderstats.FindFirstChild("Kills") as IntValue;
					const deaths = leaderstats.FindFirstChild("Deaths") as IntValue;
					if (kills && deaths) {
						const isWinner = winner === player;
						const expEarned = kills.Value * 50 - deaths.Value * 25 + ((isWinner && 100) || 0);
						const goldEarned = (isWinner && 50) || 10;
						GoldService.AddGold(player, goldEarned);
						ProfileService.IncrementExp(player, expEarned);
						this.PushResult(player, goldEarned, playerResults);
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

	GiveWeapon(player: Player) {
		const inventoryService = Knit.GetService("InventoryService");
		const playerEquipped: EquippedFormat = inventoryService.FetchEquipped(player);
		if (playerEquipped) {
			const sword = playerEquipped.Swords;
			if (sword !== undefined) {
				const swordsFolder = ReplicatedStorage.WaitForChild("ModelsFolder", 10);
				if (swordsFolder) {
					const swordTool = swordsFolder.FindFirstChild(sword);
					if (swordTool) {
						swordTool.Clone().Parent = player.WaitForChild("StarterGear", 10);
					}
				}
			}
		}
	},

	StartTimer(
		timeLimit: number,
		teams: Team[],
		playingList: Player[],
		callback: (aliveCounter: number) => Player | undefined,
	) {
		let timeRemaining = timeLimit;
		let playersAlive = true;
		let formerAliveCounter = 0;
		let aliveCounter = 0;
		while (timeRemaining > 0 && (playersAlive || aliveCounter > 1)) {
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
			wait(1);
			timeRemaining -= 1;
		}
		const winner = callback(aliveCounter);

		this.ResetMatch();
		if (winner) {
			this.DisplayResults(winner, playingList);
		}
	},

	CreateTeams(teamsList: BrickColor[]) {
		const teams: Team[] = [];
		teamsList.forEach((color: BrickColor) => {
			const team = new Instance("Team");
			team.Name = "FFA";
			team.TeamColor = color;
			team.Parent = Teams;
			teams.push(team);
		});

		return teams;
	},

	LoadMatch() {
		if (this.CurrentMap !== "None" && this.CurrentMode !== "None" && mapsFolder) {
			const currentMap = mapsFolder.FindFirstChild(this.CurrentMap);

			if (currentMap && mapHolder) {
				currentMap.Clone().Parent = mapHolder; // Clone the new map into the folder
				if (this.CurrentMode in this.ModeLibraries) {
					const modeLibraries = this.ModeLibraries; // for some reason it was bugging when i put this.ModeLibraries below lol
					const library = modeLibraries[this.CurrentMode as keyof typeof modeLibraries];
					const teams = this.CreateTeams(library.TEAMS); // Create the teams
					const playingList = library.teamPlayers();
					this.Client.InitialMatchPanel.FireAll(
						library.TIME_LIMIT,
						this.CurrentMode,
						this.CurrentMap,
						playingList.size(),
					);
					library.init(teams, playingList); // execute the init function of the mode
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

	// Initialize on service startup
	KnitInit() {
		print("Match Service Initialized | Server");

		Players.PlayerAdded.Connect((player: Player) => {
			// Leaderstats Stuff Below
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

			player.CharacterAdded.Connect((char: Model) => {
				const humanoid = char.FindFirstChildOfClass("Humanoid");

				if (humanoid) {
					humanoid.Died.Connect(() => {
						deaths.Value += 1;

						if (!RESERVED_TEAMS.includes(player.TeamColor) && this.CurrentMode !== "None") {
							const modeLibraries = this.ModeLibraries; // for some reason it was bugging when i put this.ModeLibraries below lol
							const library = modeLibraries[this.CurrentMode as keyof typeof modeLibraries];
							if (deaths.Value >= library.OUTSCORE) {
								player.TeamColor = new BrickColor("White");
							}
						}
						const tag = humanoid.FindFirstChild("creator") as ObjectValue;
						if (tag) {
							const killer = tag.Value;
							if (killer) {
								const killerKills = killer.FindFirstChild("Kills") as IntValue;
								if (killerKills) {
									killerKills.Value += 1;
								}
							}
						}
					});
				}
			});
		});

		coroutine.wrap(() => {
			// Game Loop
			// Wait until there are less than two players
			while (Players.GetPlayers().size() === 0) {
				wait(0.05);
			}
			this.Client.InitialMatchPanel.FireAll(this.IntermissionTime, this.CurrentMode, this.CurrentMap, 0);
			while (Players.GetPlayers().size() > 0) {
				//	if (Players.GetPlayers().size() >= 2) {
				// Do the voting here
				wait(this.IntermissionTime);
				VotingService.SelectChosen();
				// Display the voting page for all clients
				this.Client.InitialMatchPanel.FireAll(this.VotingTime, this.CurrentMode, this.CurrentMap, 0);
				wait(this.VotingTime);
				// Close the voting page for all clients
				VotingService.Client.CloseVoting.FireAll();
				wait(1);

				// Total up the votes to get the map and mode
				const matchSelection = VotingService.TotalVotes();
				this.CurrentMap = matchSelection[0] || this.ChooseMap();
				this.CurrentMode = matchSelection[1] || this.ChooseMode();
				SnackbarService.PushAll(`Mode: ${this.CurrentMode} | Map: ${this.CurrentMap}`);

				const lobbyTeam = Teams.FindFirstChild("Lobby") as Team;
				if (lobbyTeam) {
					// Change this to a get participants function soon
					// Display the betting UI
					BettingService.FetchBettingInfo(lobbyTeam.GetPlayers(), this.CurrentMode);
					// Update the panel for the betting time
					this.Client.InitialMatchPanel.FireAll(this.BettingTime, this.CurrentMode, this.CurrentMap, 0);
					wait(this.BettingTime);
					BettingService.Client.CloseBetting.FireAll();
					wait(1);
				}
				// Begin setting up the match
				this.LoadMatch();
				//	} else {
				//	}
			}
		})();
	},
});

export = MatchService;
