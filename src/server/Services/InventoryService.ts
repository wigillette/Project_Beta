import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import { InventoryFormat, INITIAL_INVENTORY, EquippedFormat, INITIAL_EQUIPPED } from "../../shared/InventoryInfo";

declare global {
	interface KnitServices {
		InventoryService: typeof InventoryService;
	}
}

export const InventoryService = Knit.CreateService({
	Name: "InventoryService",
	PlayerInventories: new Map<Player, InventoryFormat>(), // Stores all the users' inventories
	PlayerEquipped: new Map<Player, EquippedFormat>(), // Stores all the users' equipped items

	Client: {
		InventoryChanged: new RemoteSignal<(Inventory: InventoryFormat) => void>(),
		EquippedChanged: new RemoteSignal<(Equipped: EquippedFormat) => void>(),
		// Update the user's inventory on the client side when it changes on the server
		FetchInventory(Player: Player) {
			// Remote Signal to return the user's inventory to the client
			return this.Server.FetchInventory(Player);
		},
		FetchEquipped(Player: Player) {
			return this.Server.FetchEquipped(Player);
		},
		EquipItem(Player: Player, ItemName: string, Category: string) {
			return this.Server.EquipItem(Player, ItemName, Category);
		},
	},

	// Add an item to the user's inventory
	AddToInventory(Player: Player, ItemName: string, Category: string) {
		const playerInventory = this.FetchInventory(Player);
		if (Category in playerInventory) {
			playerInventory[Category as keyof typeof playerInventory].set(ItemName, "");
			this.PlayerInventories.set(Player, playerInventory);
			this.UpdateInventoryData(Player, playerInventory);
			this.Client.InventoryChanged.Fire(Player, playerInventory);
		}
	},

	RemoveFromInventory(Player: Player, ItemName: string, Category: string, updateClient: boolean) {
		const playerInventory = this.FetchInventory(Player);
		if (Category in playerInventory) {
			const categoryItems = playerInventory[Category as keyof typeof playerInventory];
			if (categoryItems.has(ItemName)) {
				categoryItems.delete(ItemName);
				playerInventory[Category as keyof typeof playerInventory] = categoryItems;
				this.PlayerInventories.set(Player, playerInventory);
				this.UpdateInventoryData(Player, playerInventory);
				if (updateClient) {
					this.Client.InventoryChanged.Fire(Player, playerInventory);
				}
			}
		}
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

	// Retrieve the user's equipped item or the default equipped item
	FetchEquipped(Player: Player) {
		const equippedItem = (this.PlayerEquipped.get(Player) as EquippedFormat) || INITIAL_EQUIPPED;
		return equippedItem;
	},

	// Equip an item
	EquipItem(Player: Player, ItemName: string, Category: string) {
		const equippedItems = this.FetchEquipped(Player) as EquippedFormat;
		equippedItems[Category as keyof typeof equippedItems] = ItemName;
		this.PlayerEquipped.set(Player, equippedItems);
		this.UpdateEquippedData(Player, equippedItems);
		this.Client.EquippedChanged.Fire(Player, equippedItems);
		if (Category === "Swords") {
			const matchService = Knit.GetService("MatchService");
			if (matchService) {
				matchService.AddSword(Player);
			}
		}
		return `Successfully equipped ${ItemName}`;
	},

	// Update the user's equipped items in the database
	UpdateEquippedData(Player: Player, newEquippedItems: EquippedFormat) {
		const EquippedItemsStore = Database("Equipped", Player);
		EquippedItemsStore.Set(newEquippedItems);
	},

	// Update the user's inventory in the database
	UpdateInventoryData(Player: Player, newInventory: InventoryFormat) {
		const InventoryStore = Database("Inventory", Player);
		InventoryStore.Set(newInventory);
	},

	// Initialize the inventory Map
	InitData(Player: Player, Inventory: InventoryFormat, Equipped: EquippedFormat) {
		this.PlayerInventories.set(Player, Inventory);
		this.PlayerEquipped.set(Player, Equipped);
		this.Client.InventoryChanged.Fire(Player, Inventory);
		this.Client.EquippedChanged.Fire(Player, Equipped);
	},

	// Initial function on service startup
	KnitInit() {
		print("Inventory Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => {
			this.PlayerInventories.delete(player);
		});
	},
});
