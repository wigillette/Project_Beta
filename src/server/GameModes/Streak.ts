import { KnitServer } from "@rbxts/knit";
import ObjectUtils from "@rbxts/object-utils";
import SnackbarService from "server/Services/SnackbarService";

const diedConnections = [] as RBXScriptConnection[];
const charLoadedConnections = [] as RBXScriptConnection[];
let streakTable = new Map<Player, number>();
const StreakProperties = {
	TEAMS: [new BrickColor("Bright green")],
	TEAM_NAMES: ["FFA"],
	TIME_LIMIT: 210,
	OUTSCORE: 100000,
	teamPlayers: (participants: Player[]) => {
		const matchService = KnitServer.GetService("MatchService");
		let greatestStreak = 0;
		let greatestStreakPlayer: Player | undefined = undefined;
		participants.forEach((player: Player) => {
			matchService.GiveWeapon(player, false);
			pcall(() => {
				player.TeamColor = StreakProperties.TEAMS[0];
				player.LoadCharacter();
			});

			charLoadedConnections.push(
				player.CharacterAdded.Connect((char) => {
					const humanoid = char.FindFirstChildOfClass("Humanoid");
					if (humanoid) {
						diedConnections.push(
							humanoid.Died.Connect(() => {
								const killerValue = humanoid.FindFirstChild("creator") as ObjectValue;
								if (killerValue) {
									const killer = killerValue.Value as Player;
									if (killer) {
										const formerKills = streakTable.get(killer);
										if (formerKills !== undefined) {
											const newKills = formerKills + 1;
											streakTable.set(killer, newKills);
											if (newKills > greatestStreak) {
												greatestStreak = newKills;
												if (greatestStreakPlayer !== player) {
													greatestStreakPlayer = player;
													participants.forEach((participant) => {
														SnackbarService.PushAll(
															`${killer.Name} is in the lead with a streak of ${greatestStreak}!`,
														);
													});
												}
											}
										}
									}
								}
								if (player && streakTable.has(player)) {
									streakTable.set(player, 0);
								}
							}),
						);
					}
				}),
			);
		});
	},
	init: (teams: Team[], participants: Player[]) => {
		print("Loading Streak..");
		streakTable = new Map<Player, number>();

		participants.forEach((player) => {
			streakTable.set(player, 0);
		});

		const matchService = KnitServer.GetService("MatchService");
		StreakProperties.teamPlayers(participants);
		matchService.StartTimer(
			StreakProperties.TIME_LIMIT,
			teams,
			(aliveCounter: number) => {
				let winner = undefined;
				let winnerStreak = 0;
				if (aliveCounter > 0) {
					ObjectUtils.entries(streakTable).forEach((streakEntry) => {
						if (streakEntry[1] > winnerStreak) {
							winnerStreak = streakEntry[1];
							winner = streakEntry[0];
						}
					});
				}

				streakTable.clear();
				diedConnections.forEach((connection) => {
					connection.Disconnect();
				});
				diedConnections.clear();
				charLoadedConnections.forEach((connection) => {
					connection.Disconnect();
				});
				charLoadedConnections.clear();

				return winner;
			},
			participants,
		);
	},
};

export default StreakProperties;
