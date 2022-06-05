import { Players, Workspace } from "@rbxts/services";
import { KnitClient } from "@rbxts/knit";

const obbyChestService = KnitClient.GetService("ObbyChestService");
const tradingService = KnitClient.GetService("TradingService");

export const locations = [
	[Workspace.WaitForChild("Location", 10), "toggleShop"],
	[Workspace.WaitForChild("Location5", 10), "toggleDailyReward"],
	[Workspace.WaitForChild("Location6", 10), "toggleVIPShop"],
	[Workspace.WaitForChild("Location7", 10), "toggleCrafting"],
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
		Workspace.WaitForChild("Location8", 10),
		"toggleRequests",
		() => {
			tradingService.AddPlayer();
		},
		() => {
			tradingService.RemovePlayer();
		},
	],
];
