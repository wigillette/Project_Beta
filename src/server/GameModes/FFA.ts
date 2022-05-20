import { KnitServer } from "@rbxts/knit";
import { Players, ReplicatedStorage } from "@rbxts/services";

const FFAProperties = {
	TEAMS: [new BrickColor("Bright green")],
	TIME_LIMIT: 30,
	OUTSCORE: 3,
	teamPlayers: () => {
		const matchService = KnitServer.GetService("MatchService");
		const playingList: Player[] = [];
		Players.GetPlayers().forEach((player: Player) => {
			if (player.TeamColor === new BrickColor("White")) {
				matchService.GiveWeapon(player);
				player.TeamColor = FFAProperties.TEAMS[0];
				playingList.push(player);
				pcall(() => {
					player.LoadCharacter();
				});
			}
		});
		return playingList;
	},
	init: (teams: Team[], playingList: Player[]) => {
		print("Loading FFA..");

		const matchService = KnitServer.GetService("MatchService");

		matchService.StartTimer(FFAProperties.TIME_LIMIT, teams, playingList, (aliveCounter: number) => {
			let toReturn = undefined;
			if (aliveCounter === 1) {
				toReturn = teams[0].GetPlayers()[0];
			}
			return toReturn;
		});
	},
};

export default FFAProperties;
