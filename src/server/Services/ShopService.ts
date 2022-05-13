import { KnitServer as Knit } from "@rbxts/knit";
import { ItemInfo } from "../../shared/ShopData";
import { InventoryService } from "./InventoryService";

declare global {
	interface KnitServices {
		ShopService: typeof ShopService;
	}
}

interface item {
	Name: string;
	Price: number;
}

const ShopService = Knit.CreateService({
	Name: "ShopService",

	Client: {
		// Handles client-server communication; OnServerEvent
		GetShopData() {
			return this.Server.GetShopData();
		},
		PurchaseItem(Player: Player, itemName: string, category: string) {
			return this.Server.PurchaseItem(Player, itemName, category);
		},
	},

	// Get Shop Function: returns ShopData from the server
	GetShopData() {
		const shopMap = new Map<string, number>();

		ItemInfo.forEach((item) => {
			shopMap.set(item.Name, item.Price);
		}); // Create a map for the item Info

		return shopMap;
	},

	// Check if an item exists in the shop data
	itemExists(itemName: string) {
		let exists: item | undefined = undefined;
		ItemInfo.forEach((item) => {
			if (item.Name === itemName && exists === undefined) {
				exists = item;
			}
		});

		return exists;
	},

	PurchaseItem(player: Player, itemName: string, category: string) {
		let response = "Error";
		const item = this.itemExists(itemName) as item | undefined;
		if (item) {
			const gold = item.Price; // The item's price
			if (!InventoryService.ContainsItem(player, itemName, category)) {
				print(itemName, category);
				// Check if the user already has the item
				// TO-DO: Compare price to gold
				InventoryService.AddToInventory(player, itemName, category);
				response = "Purchase Successful!";
			} else {
				response = "Already purchased!";
			}
		}

		return response;
	},

	// Initialize on service startup
	KnitInit() {
		print("Shop service has started up!");
	},
});

export = ShopService;
