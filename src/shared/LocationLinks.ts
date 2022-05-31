import { Players, Workspace } from "@rbxts/services";
import { KnitClient } from "@rbxts/knit";

const obbyChestService = KnitClient.GetService("ObbyChestService");
const matchService = KnitClient.GetService("MatchService");

export const locations = [
	[Workspace.WaitForChild("Location", 10), "toggleShop"],
	[Workspace.WaitForChild("Location5", 10), "toggleDailyReward"],
	[
		(Workspace.FindFirstChild("HalfWayChest") && (Workspace.WaitForChild("HalfWayChest") as Model).PrimaryPart) ||
			undefined,
		() => {
			obbyChestService.ClaimChest("Halfway");
		},
	],
	[
		(Workspace.FindFirstChild("FullChest") && (Workspace.WaitForChild("FullChest") as Model).PrimaryPart) ||
			undefined,

		() => {
			obbyChestService.ClaimChest("Full");
		},
	],
	[
		Workspace.WaitForChild("Location2", 10),
		() => {
			const client = Players.LocalPlayer;
			if (client) {
				const character = client.Character;
				const isPlaying = matchService.CanAccess()[0];
				if (!isPlaying && character && client.TeamColor === new BrickColor("White")) {
					pcall(() => {
						client.TeamColor = new BrickColor("Ghost grey");
						client.LoadCharacter();
					});
				}
			}
		},
	],
	[
		Workspace.WaitForChild("Location3", 10),
		() => {
			const client = Players.LocalPlayer;
			if (client) {
				const character = client.Character;
				const isPlaying = matchService.CanAccess()[0];
				if (!isPlaying && character && client.TeamColor === new BrickColor("Ghost grey")) {
					const hrp = character.FindFirstChild("HumanoidRootPart");
					pcall(() => {
						client.TeamColor = new BrickColor("White");
					});
					if (hrp) {
						const arenaEnter = Workspace.WaitForChild("ArenaEnter") as Part;
						character.SetPrimaryPartCFrame(new CFrame(arenaEnter.Position.add(new Vector3(0, 5, 0))));
					}
				}
			}
		},
	],
];
