import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import { InventoryFormat, INITIAL_INVENTORY } from "../../shared/InventoryInfo";

declare global {
	interface KnitServices {
		InventoryService: typeof InventoryService;
	}
}

export const InventoryService = Knit.CreateService({
	Name: "InventoryService",
	PlayerInventories: new Map<Player, InventoryFormat>(), // Stores all the user's inventories

	Client: {
		InventoryChanged: new RemoteSignal<(Inventory: InventoryFormat) => void>(),
		// Update the user's inventory on the client side when it changes on the server
		FetchInventory(Player: Player) {
			// Remote Signal to return the user's inventory to the client
			return this.Server.FetchInventory(Player);
		},
	},

	// Add an item to the user's inventory
	AddToInventory(Player: Player, ItemName: string, Category: string) {
		const playerInventory = this.FetchInventory(Player);
		playerInventory[Category as keyof typeof playerInventory].set(ItemName, "");
		this.PlayerInventories.set(Player, playerInventory);
		this.UpdateInventoryData(Player, playerInventory);
		this.Client.InventoryChanged.Fire(Player, playerInventory);
	},

	// Check if an item is in the user's inventory
	ContainsItem(Player: Player, ItemName: string, Category: string) {
		const playerInventory = this.FetchInventory(Player);
		const itemList = playerInventory[Category as keyof typeof playerInventory];

		return itemList.has(ItemName);
	},

	// Retrieve the user's inventory or the default value
	FetchInventory(Player: Player) {
		const playerInventory = (this.PlayerInventories.get(Player) as InventoryFormat) || INITIAL_INVENTORY;
		return playerInventory;
	},

	// Update the user's inventory in the database
	UpdateInventoryData(Player: Player, newInventory: InventoryFormat) {
		const InventoryStore = Database("Inventory", Player);
		InventoryStore.Set(newInventory);
		print(newInventory);
	},

	// Initialize the inventory Map
	InitData(Player: Player, Inventory: InventoryFormat) {
		this.PlayerInventories.set(Player, Inventory);
		this.Client.InventoryChanged.Fire(Player, Inventory);
	},

	KnitInit() {
		print("Inventory Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => {
			this.PlayerInventories.delete(player);
		});
	},
});
