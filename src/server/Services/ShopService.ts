import { KnitServer as Knit } from "@rbxts/knit";
import { ItemInfo } from "../../shared/ShopData";

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
		PurchaseItem(Player: Player, itemName: string) {
			return this.Server.PurchaseItem(Player, itemName);
		},
	},

	// Get People Function: returns InteractionData from the server
	GetShopData() {
		const shopMap = new Map<string, number>();

		ItemInfo.forEach((item) => {
			shopMap.set(item.Name, item.Price);
		}); // Create a map for the item Info

		return shopMap;
	},

	itemExists(itemName: string) {
		let exists: item | undefined = undefined;
		ItemInfo.forEach((item) => {
			if (item.Name === itemName && exists === undefined) {
				exists = item;
			}
		});

		return exists;
	},

	PurchaseItem(player: Player, itemName: string) {
		let response = "Error";
		const item = this.itemExists(itemName);
		if (item) {
			// TO-DO: Check if item exists in user's inventory, ccompare gold to price, etc.
			response = "Purchase Successful!";
		}

		return response;
	},

	// Initialize on service startup
	KnitInit() {
		print("Shop service has started up!");
	},
});

export = ShopService;
