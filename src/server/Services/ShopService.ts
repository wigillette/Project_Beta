import { KnitServer as Knit } from "@rbxts/knit";
import { ItemInfo } from "../../shared/ShopData";

declare global {
	interface KnitServices {
		ShopService: typeof ShopService;
	}
}

const ShopService = Knit.CreateService({
	Name: "ShopService",

	Client: {
		// Handles client-server communication; OnServerEvent
		GetShopData() {
			return this.Server.GetShopData();
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

	// Initialize on service startup
	KnitInit() {
		print("Shop service has started up!");
	},
});

export = ShopService;
