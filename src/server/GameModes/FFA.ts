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
	teamPlayers: (participants: Player[]) => {
		const matchService = KnitServer.GetService("MatchService");
		participants.forEach((player: Player) => {
			matchService.GiveWeapon(player, false);
			pcall(() => {
				player.TeamColor = FFAProperties.TEAMS[0];
				player.LoadCharacter();
			});
			spawn(() => {
				wait(0.5);
				FFAProperties.addSpeed(player);
			});
		});
		spawn(() => {
			wait(5);
			Players.GetPlayers().forEach((plr) => {
				FFAProperties.removeSpeed(plr);
			});
		});
	},
	init: (teams: Team[], participants: Player[]) => {
		print("Loading FFA..");

		const matchService = KnitServer.GetService("MatchService");
		FFAProperties.teamPlayers(participants);
		matchService.StartTimer(
			FFAProperties.TIME_LIMIT,
			teams,
			(aliveCounter: number) => {
				let toReturn = undefined;
				if (aliveCounter === 1) {
					toReturn = teams[0].GetPlayers()[0];
				}
				return toReturn;
			},
			participants,
		);
	},
};

export default FFAProperties;
