import { KnitServer } from "@rbxts/knit";
import { Players, ReplicatedStorage } from "@rbxts/services";

const FFAProperties = {
	TEAMS: [new BrickColor("Bright green")],
	TIME_LIMIT: 30,
	OUTSCORE: 3,
	addSpeed: (player: Player) => {
		if (player.Character) {
			const forceField = new Instance("ForceField", player.Character);
			const hum = player.Character.FindFirstChildOfClass("Humanoid");
			if (hum) {
				hum.WalkSpeed = 50;
			}
		}
	},
	removeSpeed: (player: Player) => {
		if (player.Character) {
			const hum = player.Character.FindFirstChildOfClass("Humanoid");
			if (hum) {
				hum.WalkSpeed = 16;
			}
			const forceField = player.Character.FindFirstChildOfClass("ForceField");
			if (forceField) {
				forceField.Destroy();
			}
		}
	},
	teamPlayers: () => {
		const matchService = KnitServer.GetService("MatchService");
		const playingList: Player[] = [];
		Players.GetPlayers().forEach((player: Player) => {
			if (player.TeamColor === new BrickColor("White")) {
				matchService.GiveWeapon(player);
				pcall(() => {
					player.TeamColor = FFAProperties.TEAMS[0];
					player.LoadCharacter();
				});
				spawn(() => {
					wait(0.5);
					FFAProperties.addSpeed(player);
				});
				playingList.push(player);
			}
		});
		spawn(() => {
			wait(5);
			Players.GetPlayers().forEach((plr) => {
				FFAProperties.removeSpeed(plr);
			});
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
