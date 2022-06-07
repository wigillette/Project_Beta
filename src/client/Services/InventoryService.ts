import { KnitClient as Knit } from "@rbxts/knit";
import { EquippedFormat } from "shared/InventoryInfo";
import Store from "../Rodux/Store";
const InventoryService = Knit.GetService("InventoryService");

const InventoryClient = {
	FetchInventory: (Inventory: { Swords: Map<string, number> }) => {
		// Update the rodux store with the new inventory
		Store.dispatch({
			type: "updateInventory",
			inventory: { Swords: Inventory.Swords },
		});
	},
	EquipItem: (itemName: string, category: string) => {
		InventoryService.EquipItem(itemName, category);
	},
	UpdateEquippedStore: (equippedItems: EquippedFormat) => {
		Store.dispatch({
			type: "equipItem",
			equipped: equippedItems,
		});
	},
	switchTab: (tabName: string) => {
		Store.dispatch({
			type: "switchTab",
			currentTab: tabName,
		});
	},
	init: () => {
		const initialInventory = InventoryService.FetchInventory();
		// Display the initial inventory upon joining
		InventoryClient.FetchInventory(initialInventory);

		// Update the Rodux store each time the inventory changes on the server
		InventoryService.InventoryChanged.Connect(InventoryClient.FetchInventory);

		// Update the Rodux store each time an equipped item changes on the server
		InventoryService.EquippedChanged.Connect(InventoryClient.UpdateEquippedStore);
		print("Inventory Service Initialized | Client");
	},
};

export default InventoryClient;
