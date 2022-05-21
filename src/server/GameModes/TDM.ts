import { KnitServer } from "@rbxts/knit";
import { randomizeTeams } from "server/Utils/RandomizeTeams";

const TDMProperties = {
	TEAMS: [new BrickColor("Bright red"), new BrickColor("Bright blue")],
	TIME_LIMIT: 240,
	OUTSCORE: 3,
	teamPlayers: (participants: Player[]) => {
		const matchService = KnitServer.GetService("MatchService");
		randomizeTeams(participants);
		participants.forEach((player: Player) => {
			matchService.GiveWeapon(player, true);
			pcall(() => {
				player.LoadCharacter();
			});
		});
	},
	init: (teams: Team[], participants: Player[]) => {
		print("Loading TDM..");

		const matchService = KnitServer.GetService("MatchService");
		TDMProperties.teamPlayers(participants);
		matchService.StartTimer(
			TDMProperties.TIME_LIMIT,
			teams,
			(aliveCounter: number) => {
				let toReturn = undefined;
				teams.forEach((team) => {
					if (team.GetPlayers().size() === 0) {
						if (aliveCounter > 0) {
							toReturn = team.Name;
						} else {
							toReturn = "None";
						}
					}
				});
				return toReturn;
			},
			participants,
		);
	},
};

export default TDMProperties;
