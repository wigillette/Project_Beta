import { KnitServer } from "@rbxts/knit";
import Object from "@rbxts/object-utils";
import { InsertService, ServerStorage } from "@rbxts/services";
import { PACK_INFO } from "shared/ShopData";
const tools = ServerStorage.WaitForChild("Tools");
const InventoryService = KnitServer.GetService("InventoryService");

export const gamepassesOnJoin = [8444469, 8353921, 8444470, 8353962, 8353933];

export const gamepassEvents = {
	8444469: (client: Player) => {
		// Hot Cocoa
		const hotCocoa = tools.FindFirstChild("HotCocoa") as Tool;
		if (hotCocoa) {
			hotCocoa.Clone().Parent = client.WaitForChild("Backpack", 10);
			hotCocoa.Clone().Parent = client.WaitForChild("Starterpack", 10);
		}
	},
	8270062: (client: Player) => {
		// Double EXP
	},
	8353914: (client: Player) => {
		// Katana
		InventoryService.AddToInventory(client, "Katana", "Swords");
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
	},
	8353921: (client: Player) => {
		// Custom Chat Tag
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
	},
	8353962: (client: Player) => {
		// Text Sign
		const textSign = tools.FindFirstChild("TextSign") as Tool;
		if (textSign) {
			textSign.Clone().Parent = client.WaitForChild("Backpack", 10);
			textSign.Clone().Parent = client.WaitForChild("Starterpack", 10);
		}
	},
	8444456: (client: Player) => {
		// Starter Up
		const goldService = KnitServer.GetService("GoldService");
		if (goldService) {
			goldService.AddGold(client, 250);
		}
	},
	8353972: (client: Player) => {
		// x2 Coins
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
	},
};
