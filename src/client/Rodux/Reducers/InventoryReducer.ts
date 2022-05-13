import Rodux from "@rbxts/rodux";
import { InventoryFormat, INITIAL_INVENTORY, EquippedFormat, INITIAL_EQUIPPED } from "../../../shared/InventoryInfo";
import ObjectUtils from "@rbxts/object-utils";
import { ReplicatedStorage } from "@rbxts/services";

// Models Folder:
const modelsFolder = ReplicatedStorage.WaitForChild("ModelsFolder", 10);

export interface inventoryState {
	toggle: boolean;
	inventory: InventoryFormat;
	equipped: EquippedFormat;
}

interface Action {
	type: string;
	inventory?: InventoryFormat;
	equipped?: EquippedFormat;
}

const inventoryReducer = Rodux.createReducer(
	{
		toggle: false,
		inventory: INITIAL_INVENTORY,
		equipped: INITIAL_EQUIPPED,
	},
	{
		updateInventory: (state: inventoryState, action: Action) => {
			const newState: inventoryState = {
				toggle: state.toggle,
				inventory: INITIAL_INVENTORY,
				equipped: INITIAL_EQUIPPED,
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
				inventory: state.inventory,
				equipped: state.equipped,
			};

			return newState;
		},
		equipItem: (state: inventoryState, action: Action) => {
			const newState: inventoryState = {
				toggle: state.toggle,
				inventory: state.inventory,
				equipped: state.equipped,
			};

			if (action.equipped) {
				newState.equipped = action.equipped;
			}

			print("Inventory Store Equipped Update Successful | Client");
			return newState;
		},
	},
);

export default inventoryReducer;
