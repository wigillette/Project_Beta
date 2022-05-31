import { KnitServer as Knit } from "@rbxts/knit";
import { PACK_INFO, RARITIES, PACK_PRICES } from "../../shared/ShopData";
import { InventoryService } from "./InventoryService";
import { GoldService } from "./GoldService";
import SnackbarService from "./SnackbarService";
import { MarketplaceService } from "@rbxts/services";

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

		PurchasePack(Player: Player, packName: string) {
			coroutine.wrap(() => {
				this.Server.PurchasePack(Player, packName);
			})();
		},
	},

	PurchasePack(player: Player, packName: string) {
		const rarities = RARITIES[packName as keyof typeof RARITIES];
		let packPrice = PACK_PRICES[packName as keyof typeof PACK_PRICES];
		const swords = PACK_INFO[packName as keyof typeof PACK_INFO];
		const userGold = GoldService.GetGold(player);

		if (MarketplaceService.UserOwnsGamePassAsync(player.UserId, 8453352)) {
			packPrice -= 0.1 * packPrice;
		}

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

	// Initialize on service startup
	KnitInit() {
		print("Shop Service Initialized | Server");
	},
});

export = ShopService;
