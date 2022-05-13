import { KnitClient as Knit } from "@rbxts/knit";
import Store from "../Rodux/Store";
const InventoryService = Knit.GetService("InventoryService");

const InventoryClient = {
	FetchInventory: (Inventory: { Swords: Map<string, Model | Tool | ""> }) => {
		print("Dispatching updated inventory to Store.. | Client");
		// Update the rodux store with the new inventory
		Store.dispatch({
			type: "updateInventory",
			inventory: { Swords: Inventory.Swords },
		});
	},
	init: () => {
		const initialInventory = InventoryService.FetchInventory();
		print(initialInventory);
		// Display the initial inventory upon joining
		InventoryClient.FetchInventory(initialInventory);

		// Update the Rodux store each time the inventory changes on the server
		InventoryService.InventoryChanged.Connect(InventoryClient.FetchInventory);
		print("Inventory Service Initialized | Client");
	},
};

export default InventoryClient;
