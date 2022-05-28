import { Workspace } from "@rbxts/services";
import { KnitClient } from "@rbxts/knit";

const obbyChestService = KnitClient.GetService("ObbyChestService");

export const locations = [
	[Workspace.WaitForChild("Location", 10), "toggleShop"],
	[Workspace.WaitForChild("Location5", 10), "toggleDailyReward"],
	[
		(Workspace.FindFirstChild("HalfWayChest") && (Workspace.WaitForChild("HalfWayChest") as Model).PrimaryPart) ||
			undefined,
		[
			() => {
				obbyChestService.ClaimChest("Halfway");
			},
			() => {
				print("Left chest");
			},
		],
	],
	[
		(Workspace.FindFirstChild("FullChest") && (Workspace.WaitForChild("FullChest") as Model).PrimaryPart) ||
			undefined,
		[
			() => {
				obbyChestService.ClaimChest("Full");
			},
			() => {
				print("Left chest");
			},
		],
	],
];
