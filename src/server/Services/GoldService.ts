import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { MarketplaceService, Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import { PRODUCT_FUNCTIONS } from "server/Utils/DeveloperProducts";
import { gamepassesOnJoin, gamepassEvents, gamepassInfo } from "../Utils/Gamepasses";
import ObjectUtils from "@rbxts/object-utils";

declare global {
	interface KnitServices {
		GoldService: typeof GoldService;
	}
}

const ProcessReceipt = (receiptInfo: ReceiptInfo) => {
	const player = Players.GetPlayerByUserId(receiptInfo.PlayerId);

	if (!player) {
		return Enum.ProductPurchaseDecision.NotProcessedYet;
	}

	if (receiptInfo.ProductId in PRODUCT_FUNCTIONS) {
		const handler = PRODUCT_FUNCTIONS[receiptInfo.ProductId as keyof typeof PRODUCT_FUNCTIONS];
		const response = pcall(handler, receiptInfo, player);
		if (!response[0] || response[1] === 0) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		} else {
			GoldService.AddGold(player, response[1]);
		}
	} else if (receiptInfo.ProductId in gamepassEvents) {
		const handler = gamepassEvents[receiptInfo.ProductId as keyof typeof gamepassEvents];
		const response = pcall(() => {
			handler(player);
		});

		if (!response[0]) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}
	}

	return Enum.ProductPurchaseDecision.PurchaseGranted;
};

export const GoldService = Knit.CreateService({
	Name: "GoldService",

	// Server-exposed Signals/Fields
	PlayerGold: new Map<Player, number>(),

	Client: {
		GoldChanged: new RemoteSignal<(Gold: number) => void>(),
		GetGold(Player: Player) {
			return this.Server.GetGold(Player);
		},
		GetProducts(Player: Player) {
			return this.Server.GetProducts();
		},
	},

	AddGold(Player: Player, Amount: number) {
		if (Amount !== 0) {
			print(`Adding ${Amount} gold to ${Player.Name} | Server`);
			const gold = this.GetGold(Player);
			const newGold = gold + Amount;

			this.PlayerGold.set(Player, newGold);
			this.Client.GoldChanged.Fire(Player, newGold);
			this.UpdateGoldData(Player, newGold);
		}
	},

	GetProducts() {
		return {
			products: MarketplaceService.GetDeveloperProductsAsync().GetCurrentPage(),
			gamepasses: gamepassInfo,
		};
	},

	GetGold(Player: Player) {
		const gold = this.PlayerGold.get(Player);
		return gold ?? 0;
	},

	UpdateGoldData(Player: Player, newGold: number) {
		const GoldStore = Database("Gold", Player);
		GoldStore.Set(newGold);
	},

	InitData(Player: Player, Gold: number) {
		this.PlayerGold.set(Player, Gold);
		this.Client.GoldChanged.Fire(Player, Gold);
	},

	KnitInit() {
		print("Gold Service Initialized | Server");
		MarketplaceService.ProcessReceipt = ProcessReceipt;
		Players.PlayerAdded.Connect((player) => {
			// Handling recurring gamepasses
			gamepassesOnJoin.forEach((gamepassId) => {
				if (MarketplaceService.UserOwnsGamePassAsync(player.UserId, gamepassId)) {
					if (gamepassId in gamepassEvents) {
						gamepassEvents[gamepassId as keyof typeof gamepassEvents](player);
					}
				}
			});
		});
		Players.PlayerRemoving.Connect((player) => this.PlayerGold.delete(player));
	},
});
