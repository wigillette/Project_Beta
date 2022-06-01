import { KnitServer } from "@rbxts/knit";
import Object from "@rbxts/object-utils";
import { InsertService, MarketplaceService, ServerStorage } from "@rbxts/services";
import { PACK_INFO } from "shared/ShopData";
const tools = ServerStorage.WaitForChild("Tools");
const InventoryService = KnitServer.GetService("InventoryService");
const snackbarService = KnitServer.GetService("SnackbarService");
export const gamepassesOnJoin = [48718165, 48718024, 48718409, 48719124, 48719297];

export const recurringGamepasses = [48718165, 48718024, 48718409, 48719124];

export const gamepassEvents = {
	48719124: (client: Player) => {
		// Hot Cocoa
		const hotCocoa = tools.FindFirstChild("HotCocoa") as Tool;
		if (hotCocoa) {
			hotCocoa.Clone().Parent = client.WaitForChild("Backpack", 10);
		}
	},
	48718649: (client: Player) => {
		// Double EXP
		snackbarService.PushPlayer(client, "Successfully purchased Double Experience!");
	},
	48718024: (client: Player) => {
		// Boombox
		const boombox = tools.FindFirstChild("BoomBox") as Tool;
		if (boombox) {
			boombox.Clone().Parent = client.WaitForChild("Backpack", 10);
		}
	},
	48718806: (client: Player) => {
		// Golden Katana
		InventoryService.AddToInventory(client, "Golden Katana", "Swords");
	},
	48718240: (client: Player) => {
		// Katana
		InventoryService.AddToInventory(client, "Katana", "Swords");
	},
	48718165: (client: Player) => {
		// Image Sign
		const imageSign = tools.FindFirstChild("ImageSign") as Tool;
		if (imageSign) {
			imageSign.Clone().Parent = client.WaitForChild("Backpack", 10);
		}
	},
	8353921: (client: Player) => {
		// Custom Chat Tag
		snackbarService.PushPlayer(client, "Successfully purchased Custom Chat Tag!");
	},
	48719297: (client: Player) => {
		// Random Hat
		client.Chatted.Connect((msg) => {
			if (client && client.Character) {
				if (string.sub(msg, 1, 5) === "!hat") {
					const assetId = tonumber(string.sub(msg, 6));
					if (assetId !== undefined) {
						const hat = InsertService.LoadAsset(assetId);
						const wear = hat.FindFirstChildOfClass("Accessory");
						if (wear) {
							wear.Clone().Parent = client.Character;
							client.CharacterAdded.Connect((char) => {
								wear.Clone().Parent = char;
							});
						}
					}
				}
			}
		});
		snackbarService.PushPlayer(client, "Successfully purchased Hat Generator!");
	},
	48718409: (client: Player) => {
		// Text Sign
		const textSign = tools.FindFirstChild("TextSign") as Tool;
		if (textSign) {
			textSign.Clone().Parent = client.WaitForChild("Backpack", 10);
		}
	},
	48718895: (client: Player) => {
		// Starter Up
		const goldService = KnitServer.GetService("GoldService");
		if (goldService) {
			goldService.AddGold(client, 250);
		}
		const rareItems = [] as string[];
		Object.entries(PACK_INFO).forEach((pack) => {
			pack[1].forEach((sword) => {
				if (sword.Rarity === "Rare") {
					rareItems.push(sword.Name);
				}
			});
		});

		const randomSword = rareItems[math.floor(math.random() * rareItems.size())];
		InventoryService.AddToInventory(client, randomSword, "Swords");
		snackbarService.PushPlayer(client, "Successfully purchased Starter Up. Check your inventory!");
	},
	48718513: (client: Player) => {
		// x2 Coins
		snackbarService.PushPlayer(client, "Successfully purchased Double Coins!");
	},
	48719460: (client: Player) => {
		snackbarService.PushPlayer(client, "Successfully purchased VIP!");
	},
};

export const gamepassInfo = Object.keys(gamepassEvents).map((gamepassId) => {
	return [gamepassId, MarketplaceService.GetProductInfo(gamepassId, Enum.InfoType.GamePass)];
});
