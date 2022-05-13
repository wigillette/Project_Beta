import Rodux from "@rbxts/rodux";
import { InventoryFormat, INITIAL_INVENTORY } from "../../../shared/InventoryInfo";
import ObjectUtils from "@rbxts/object-utils";
import { ReplicatedStorage } from "@rbxts/services";

// Models Folder:
const modelsFolder = ReplicatedStorage.WaitForChild("ModelsFolder", 10);

export interface inventoryState {
	toggle: boolean;
	inventory: { Swords: Map<string, Model | Tool | ""> };
}

interface Action {
	type: string;
	inventory?: InventoryFormat;
}

const inventoryReducer = Rodux.createReducer(
	{
		toggle: false,
		inventory: INITIAL_INVENTORY,
	},
	{
		updateInventory: (state: inventoryState, action: Action) => {
			const newState: inventoryState = {
				toggle: state.toggle,
				inventory: INITIAL_INVENTORY,
			};

			if (action.inventory && modelsFolder) {
				const newMap = new Map<string, Model | Tool>();
				let item;

				// Create a duplicate map, storing the models and their respective prices

				ObjectUtils.keys(action.inventory.Swords).forEach((swordName) => {
					item = modelsFolder.FindFirstChild(swordName) as Model | Tool;
					if (item) {
						newMap.set(swordName, item);
					}
				});

				newState.inventory.Swords = newMap;
			}

			print("Inventory Store Items Update Successful | Client");
			return newState;
		},
		toggleInventory: (state: inventoryState, action: Action) => {
			const newState: inventoryState = {
				toggle: !state.toggle,
				inventory: {
					Swords: state.inventory.Swords,
				},
			};

			return newState;
		},
	},
);

export default inventoryReducer;
