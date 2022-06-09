import { MarketplaceService, Players, Workspace } from "@rbxts/services";
import { KnitClient } from "@rbxts/knit";

const obbyChestService = KnitClient.GetService("ObbyChestService");
const tradingService = KnitClient.GetService("TradingService");
const profileService = KnitClient.GetService("ProfileService");

export const locations = [
	[Workspace.WaitForChild("Location", 10), "toggleShop"],
	[Workspace.WaitForChild("Location5", 10), "toggleDailyReward"],
	[
		Workspace.WaitForChild("Location6", 10),
		"toggleVIPShop",
		undefined,
		undefined,
		() => {
			return [
				MarketplaceService.UserOwnsGamePassAsync(Players.LocalPlayer.UserId, 48719460),
				"Must own the VIP gamepass to access the VIP merchant",
			];
		},
	],
	[
		Workspace.WaitForChild("Location7", 10),
		"toggleCrafting",
		undefined,
		undefined,
		() => {
			return [profileService.GetProfile().Level >= 10, "Must be at least level 10 to craft!"];
		},
	],
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
		() => {
			return [profileService.GetProfile().Level >= 15, "Must be at least level 15 to trade!"];
		},
	],
];
