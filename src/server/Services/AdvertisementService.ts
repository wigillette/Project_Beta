import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import Object from "@rbxts/object-utils";
import { MarketplaceService, Players } from "@rbxts/services";

declare global {
	interface KnitServices {
		AdvertisementService: typeof AdvertisementService;
	}
}

const AdvertisementService = Knit.CreateService({
	Name: "AdvertisementService",

	Boards: new Map<number, Player | undefined>(),

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
					this.ClaimBoard(client, groupId, boardKey);
					connection.Disconnect();
				} else if (client.UserId === userId && !isPurchased) {
					connection.Disconnect();
				}
			},
		);
		MarketplaceService.PromptProductPurchase(client, 934535878);
	},

	ClaimBoard(client: Player, groupId: number, boardKey: number) {
		this.Boards.set(boardKey, client);
		this.Client.UpdateBoards.FireAll(groupId, true, boardKey);
	},

	FreeBoard(boardKey: number) {
		this.Client.UpdateBoards.FireAll(5255599, false, boardKey);
	},

	KnitInit() {
		print("Advertisement Service Initialized | Server");
		for (let i = 1; i < 7; i++) {
			this.Boards.set(i, undefined);
		}

		Players.PlayerRemoving.Connect((plr) => {
			Object.entries(this.Boards).forEach((board) => {
				if (board[1] === plr) {
					this.Boards.set(board[0], undefined);
					this.FreeBoard(board[0]);
				}
			});
		});
	},
});

export default AdvertisementService;
