import { KnitServer } from "@rbxts/knit";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { randomizeTeams } from "server/Utils/RandomizeTeams";

const diedConnections = [] as RBXScriptConnection[];
const charLoadedConnections = [] as RBXScriptConnection[];

const TeamswapProperties = {
	TEAMS: [new BrickColor("Bright red"), new BrickColor("Bright blue")],
	TEAM_NAMES: ["Red", "Blue"],
	TIME_LIMIT: 240,
	OUTSCORE: 3,
	teamPlayers: (participants: Player[]) => {
		const matchService = KnitServer.GetService("MatchService");
		randomizeTeams(participants);
		participants.forEach((player: Player) => {
			matchService.GiveWeapon(player, true);
			charLoadedConnections.push(
				player.CharacterAdded.Connect((char) => {
					const hum = char.FindFirstChildOfClass("Humanoid");
					if (hum) {
						diedConnections.push(
							hum.Died.Connect(() => {
								if (player.TeamColor === TeamswapProperties.TEAMS[0]) {
									player.TeamColor = TeamswapProperties.TEAMS[1];
								} else {
									player.TeamColor = TeamswapProperties.TEAMS[0];
								}
							}),
						);
					}
				}),
			);
			pcall(() => {
				player.LoadCharacter();
			});
		});
	},
	init: (teams: Team[], participants: Player[]) => {
		print("Loading Teamswap..");

		const matchService = KnitServer.GetService("MatchService");
		TeamswapProperties.teamPlayers(participants);
		matchService.StartTimer(
			TeamswapProperties.TIME_LIMIT,
			teams,
			(aliveCounter: number) => {
				let toReturn = undefined;
				teams.forEach((team) => {
					if (team.GetPlayers().size() !== 0) {
						toReturn = team.Name;
					}
				});

				diedConnections.forEach((connection) => {
					connection.Disconnect();
				});
				diedConnections.clear();
				charLoadedConnections.forEach((connection) => {
					connection.Disconnect();
				});
				charLoadedConnections.clear();
				return toReturn;
			},
			participants,
		);
	},
};

export default TeamswapProperties;
