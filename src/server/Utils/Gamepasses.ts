import { KnitServer } from "@rbxts/knit";
import Object from "@rbxts/object-utils";
import { InsertService, MarketplaceService, ServerStorage } from "@rbxts/services";
import { PACK_INFO } from "shared/ShopData";
const tools = ServerStorage.WaitForChild("Tools");
const InventoryService = KnitServer.GetService("InventoryService");
const snackbarService = KnitServer.GetService("SnackbarService");
export const gamepassesOnJoin = [8444469, 8353921, 8444470, 8353962, 8353933];

export const recurringGamepasses = [8353933, 8444469, 8353962];

export const gamepassEvents = {
	8444469: (client: Player) => {
		// Hot Cocoa
		const hotCocoa = tools.FindFirstChild("HotCocoa") as Tool;
		if (hotCocoa) {
			hotCocoa.Clone().Parent = client.WaitForChild("Backpack", 10);
			hotCocoa.Clone().Parent = client.WaitForChild("Starterpack", 10);
		}
		snackbarService.PushPlayer(client, "Successfully purchased Hot Cocoa!");
	},
	8270062: (client: Player) => {
		// Double EXP
		snackbarService.PushPlayer(client, "Successfully purchased Double Experience!");
	},
	8353914: (client: Player) => {
		// Katana
		InventoryService.AddToInventory(client, "Katana", "Swords");
		snackbarService.PushPlayer(client, "Successfully purchased Katana! Check your inventory!");
	},
	8353982: (client: Player) => {
		// Golden Katana
		InventoryService.AddToInventory(client, "Golden Katana", "Swords");
	},
	8353933: (client: Player) => {
		// Image Sign
		const imageSign = tools.FindFirstChild("ImageSign") as Tool;
		if (imageSign) {
			imageSign.Clone().Parent = client.WaitForChild("Backpack", 10);
			imageSign.Clone().Parent = client.WaitForChild("Starterpack", 10);
		}
		snackbarService.PushPlayer(client, "Successfully purchased Image Sign!");
	},
	8353921: (client: Player) => {
		// Custom Chat Tag
		snackbarService.PushPlayer(client, "Successfully purchased Custom Chat Tag!");
	},
	8444470: (client: Player) => {
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
	8353962: (client: Player) => {
		// Text Sign
		const textSign = tools.FindFirstChild("TextSign") as Tool;
		if (textSign) {
			textSign.Clone().Parent = client.WaitForChild("Backpack", 10);
			textSign.Clone().Parent = client.WaitForChild("Starterpack", 10);
		}
		snackbarService.PushPlayer(client, "Successfully purchased Text Sign!");
	},
	8444456: (client: Player) => {
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
	8353972: (client: Player) => {
		// x2 Coins
		snackbarService.PushPlayer(client, "Successfully purchased Double Coins!");
	},
};

export const gamepassInfo = Object.keys(gamepassEvents).map((gamepassId) => {
	return [gamepassId, MarketplaceService.GetProductInfo(gamepassId, Enum.InfoType.GamePass)];
});
