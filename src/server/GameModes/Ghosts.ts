import { KnitServer } from "@rbxts/knit";
import { Players, ReplicatedStorage, TweenService } from "@rbxts/services";
import { randomizeTeams } from "server/Utils/RandomizeTeams";

const GhostProperties = {
	TEAMS: [new BrickColor("Bright red"), new BrickColor("Bright blue")],
	TEAM_NAMES: ["Ghosts", "Survivors"],
	TIME_LIMIT: 180,
	OUTSCORE: 1,
	GHOST_PERCENTAGE: 0.25,
	teamPlayers: (participants: Player[]) => {
		const matchService = KnitServer.GetService("MatchService");
		const ghostAmt = math.round(participants.size() * GhostProperties.GHOST_PERCENTAGE);
		const ghosts: Player[] = [];

		while (ghosts.size() !== ghostAmt) {
			const randomGhost = participants[math.floor(math.random() * participants.size())];
			if (!ghosts.includes(randomGhost)) {
				ghosts.push(randomGhost);
				pcall(() => {
					randomGhost.TeamColor = GhostProperties.TEAMS[0];
					const charLoadedConnection = randomGhost.CharacterAdded.Connect((char) => {
						if (char) {
							const humanoid = char.FindFirstChildOfClass("Humanoid");
							if (humanoid) {
								char.GetDescendants().forEach((child) => {
									if (child.IsA("BasePart") || child.IsA("MeshPart") || child.IsA("Part")) {
										child.Transparency = 1;
										spawn(() => {
											while (humanoid.Health > 0) {
												TweenService.Create(
													child,
													new TweenInfo(
														0.3,
														Enum.EasingStyle.Quad,
														Enum.EasingDirection.Out,
														0,
														false,
														0,
													),
													{ Transparency: 0.7 },
												).Play();
												wait(2);
												TweenService.Create(
													child,
													new TweenInfo(
														0.3,
														Enum.EasingStyle.Quad,
														Enum.EasingDirection.Out,
														0,
														false,
														0,
													),
													{ Transparency: 1 },
												).Play();
												wait(10);
											}
										});
									} else if (child.IsA("Accessory")) {
										char.Archivable = true;
										child.Destroy();
										char.Archivable = false;
									}
								});
							}
						}
						charLoadedConnection.Disconnect();
					});
				});
			}
		}

		participants.forEach((player: Player) => {
			if (!ghosts.includes(player)) {
				player.TeamColor = GhostProperties.TEAMS[1];
			}
			matchService.GiveWeapon(player, true);
			pcall(() => {
				player.LoadCharacter();
			});
		});
	},
	init: (teams: Team[], participants: Player[]) => {
		print("Loading Ghosts..");

		const matchService = KnitServer.GetService("MatchService");
		GhostProperties.teamPlayers(participants);
		matchService.StartTimer(
			GhostProperties.TIME_LIMIT,
			teams,
			(aliveCounter: number) => {
				let toReturn = undefined;
				teams.forEach((team) => {
					if (team.GetPlayers().size() !== 0) {
						toReturn = team.Name;
					}
				});

				return toReturn;
			},
			participants,
		);
	},
};

export default GhostProperties;