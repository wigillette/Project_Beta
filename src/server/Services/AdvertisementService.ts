import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { MarketplaceService, Players } from "@rbxts/services";

declare global {
	interface KnitServices {
		AdvertisementService: typeof AdvertisementService;
	}
}

const AdvertisementService = Knit.CreateService({
	Name: "AdvertisementService",

	Client: {
		UpdateBoards: new RemoteSignal<(groupId: number, isClaimed: boolean, boardKey: number) => void>(),
		PurchaseBoard(client: Player, boardKey: number, groupId: number) {
			this.Server.PurchaseBoard(client, boardKey, groupId);
		},
	},

	PurchaseBoard(client: Player, boardKey: number, groupId: number) {
		const connection = MarketplaceService.PromptProductPurchaseFinished.Connect(
			(userId: number, productId: number, isPurchased: boolean) => {
				if (client.UserId === userId && isPurchased && productId === 934535878) {
					this.ClaimBoard(groupId, boardKey);
					connection.Disconnect();
				} else if (client.UserId === userId && !isPurchased) {
					connection.Disconnect();
				}
			},
		);
		MarketplaceService.PromptProductPurchase(client, 934535878);
	},

	ClaimBoard(groupId: number, boardKey: number) {
		this.Client.UpdateBoards.FireAll(groupId, true, boardKey);
	},

	FreeBoard(boardKey: number) {
		this.Client.UpdateBoards.FireAll(5255599, false, boardKey);
	},

	KnitInit() {
		print("Advertisement Service Initialized | Server");
	},
});

export default AdvertisementService;
