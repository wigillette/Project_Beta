import { KnitServer as Knit } from "@rbxts/knit";
import { ItemInfo, PACK_INFO, RARITIES, PACK_PRICES } from "../../shared/ShopData";
import { InventoryService } from "./InventoryService";
import { GoldService } from "./GoldService";
import SnackbarService from "./SnackbarService";

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
		PurchasePack(Player: Player, packName: string) {
			coroutine.wrap(() => {
				this.Server.PurchasePack(Player, packName);
			})();
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

	PurchasePack(player: Player, packName: string) {
		const rarities = RARITIES[packName as keyof typeof RARITIES];
		const packPrice = PACK_PRICES[packName as keyof typeof PACK_PRICES];
		const swords = PACK_INFO[packName as keyof typeof PACK_INFO];
		const userGold = GoldService.GetGold(player);

		if (userGold >= packPrice) {
			// The random percentage choice
			const choice = math.round(math.random() * 100);
			let raritySum = 0;
			let counter = 0;

			let swordChoice;
			let swordInfo;
			let swordRarity;

			// Figure out which range the random percentage choice is in
			while (raritySum <= choice && counter < swords.size()) {
				swordInfo = swords[counter];
				swordChoice = swordInfo.Name;
				swordRarity = rarities[swordInfo.Rarity as keyof typeof rarities];

				// Add the rarity to the sum to check what range the random number is in
				raritySum += swordRarity;
				counter += 1; // Continue traversing through the list of swords in the pack
				wait(0.01);
			}

			if (swordChoice !== undefined) {
				GoldService.AddGold(player, -packPrice);
				InventoryService.AddToInventory(player, swordChoice, "Swords");
				SnackbarService.PushPlayer(player, `You have won the ${swordChoice} sword!`);
			} else {
				SnackbarService.PushPlayer(player, `Purchase failed. No gold lost.`);
			}
		} else {
			SnackbarService.PushPlayer(player, `Insufficient gold`);
		}
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
			const price = item.Price; // The item's price
			if (!InventoryService.ContainsItem(player, itemName, category)) {
				// Check if the user already has the item
				const userGold = GoldService.GetGold(player);
				if (userGold >= price) {
					// Check if the user can afford the item
					GoldService.AddGold(player, -price);
					InventoryService.AddToInventory(player, itemName, category);
					response = "Purchase Successful!";
				} else {
					response = "Insufficient gold";
				}
			} else {
				response = "Already purchased!";
			}
		}

		return response;
	},

	// Initialize on service startup
	KnitInit() {
		print("Shop Service Initialized | Server");
	},
});

export = ShopService;
