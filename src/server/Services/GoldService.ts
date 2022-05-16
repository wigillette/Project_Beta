import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { MarketplaceService, Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";

declare global {
	interface KnitServices {
		GoldService: typeof GoldService;
	}
}

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
		return MarketplaceService.GetDeveloperProductsAsync();
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
		Players.PlayerRemoving.Connect((player) => this.PlayerGold.delete(player));
	},
});
