import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { MarketplaceService, Players, Workspace } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import { PRODUCT_FUNCTIONS } from "server/Utils/DeveloperProducts";
import { gamepassesOnJoin, gamepassEvents, gamepassInfo, recurringGamepasses } from "../Utils/Gamepasses";
import ObjectUtils from "@rbxts/object-utils";
import { donationProducts } from "shared/DonationsInfo";
import advertisementService from "./AdvertisementService";
import SnackbarService from "./SnackbarService";

declare global {
	interface KnitServices {
		GoldService: typeof GoldService;
	}
}

const purchaseGamepass = (client: Player, gamePassId: number) => {
	if (client && gamePassId in gamepassEvents) {
		const handler = gamepassEvents[gamePassId as keyof typeof gamepassEvents];
		const response = pcall(() => {
			handler(client);
		});
	}
};

const ProcessReceipt = (receiptInfo: ReceiptInfo, groupId?: number, boardKey?: number) => {
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
	} else {
		let donationAmount: number | undefined = undefined;
		ObjectUtils.entries(donationProducts).forEach((donationProduct) => {
			if (donationProduct[1] === receiptInfo.ProductId && donationAmount === undefined) {
				donationAmount = donationProduct[0];
			}
		});

		if (donationAmount !== undefined) {
			const databaseService = Knit.GetService("DatabaseService");
			databaseService.AppendPendingEntry(player.UserId, "Donations", donationAmount);
		}
	}

	return Enum.ProductPurchaseDecision.PurchaseGranted;
};

export const GoldService = Knit.CreateService({
	Name: "GoldService",

	// Server-exposed Signals/Fields
	PlayerGold: new Map<Player, number>(),
	LoungeDetector: Workspace.WaitForChild("Location4") as Part,

	Client: {
		GoldChanged: new RemoteSignal<(Gold: number) => void>(),
		GetGold(client: Player, player?: Player) {
			return this.Server.GetGold(client, player);
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

	GetGold(client: Player, player?: Player) {
		let gold = this.PlayerGold.get(client);
		if (player) {
			gold = this.PlayerGold.get(player);
		}
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

	LoungeListener() {
		this.LoungeDetector.Touched.Connect((hit) => {
			const char = hit.Parent as Model;
			if (char) {
				const humanoid = char.FindFirstChildOfClass("Humanoid");
				if (humanoid) {
					const player = Players.GetPlayerFromCharacter(char);
					if (player && char.PrimaryPart) {
						if (!MarketplaceService.UserOwnsGamePassAsync(player.UserId, 8453352)) {
							char.SetPrimaryPartCFrame(new CFrame(new Vector3(270.756, 75.248, -266.533)));
							SnackbarService.PushPlayer(
								player,
								"You must own the VIP gamepass to access the Iceberg Lounge!",
							);
						}
					}
				}
			}
		});
	},

	KnitInit() {
		print("Gold Service Initialized | Server");
		this.LoungeListener();
		MarketplaceService.PromptGamePassPurchaseFinished.Connect(
			(player: Player, gamepassId: number, wasPurchased: boolean) => {
				if (wasPurchased) {
					purchaseGamepass(player, gamepassId);
				}
			},
		);
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

			player.CharacterAdded.Connect((char) => {
				recurringGamepasses.forEach((gamepassId) => {
					if (MarketplaceService.UserOwnsGamePassAsync(player.UserId, gamepassId)) {
						if (gamepassId in gamepassEvents) {
							gamepassEvents[gamepassId as keyof typeof gamepassEvents](player);
						}
					}
				});
			});
		});
		Players.PlayerRemoving.Connect((player) => this.PlayerGold.delete(player));
	},
});
