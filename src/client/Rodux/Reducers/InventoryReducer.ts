import Rodux from "@rbxts/rodux";
import { InventoryFormat, INITIAL_INVENTORY, EquippedFormat, INITIAL_EQUIPPED } from "../../../shared/InventoryInfo";
import ObjectUtils from "@rbxts/object-utils";

export interface inventoryState {
	toggle: boolean;
	inventory: InventoryFormat;
	equipped: EquippedFormat;
	currentTab: string;
}

interface Action {
	type: string;
	inventory?: InventoryFormat;
	equipped?: EquippedFormat;
	currentTab?: string;
	toggle?: boolean;
}

const inventoryReducer = Rodux.createReducer(
	{
		toggle: false,
		inventory: INITIAL_INVENTORY,
		equipped: INITIAL_EQUIPPED,
		currentTab: "Swords",
	},
	{
		updateInventory: (state: inventoryState, action: Action) => {
			const newState: inventoryState = {
				toggle: state.toggle,
				inventory: INITIAL_INVENTORY,
				equipped: INITIAL_EQUIPPED,
				currentTab: state.currentTab,
			};

			if (action.inventory) {
				newState.inventory.Swords = action.inventory.Swords;
			}

			return newState;
		},
		toggleInventory: (state: inventoryState, action: Action) => {
			const newState: inventoryState = {
				toggle: !state.toggle,
				inventory: state.inventory,
				equipped: state.equipped,
				currentTab: state.currentTab,
			};

			return newState;
		},
		setInventoryToggle: (state: inventoryState, action: Action) => {
			const newState = state;
			if (action.toggle !== undefined) {
				newState.toggle = action.toggle;
			}

			return newState;
		},
		equipItem: (state: inventoryState, action: Action) => {
			const newState: inventoryState = {
				toggle: state.toggle,
				inventory: state.inventory,
				equipped: state.equipped,
				currentTab: state.currentTab,
			};

			if (action.equipped) {
				newState.equipped = action.equipped;
			}

			return newState;
		},
		switchTab: (state: inventoryState, action: Action) => {
			const newState: inventoryState = {
				toggle: state.toggle,
				inventory: state.inventory,
				equipped: state.equipped,
				currentTab: state.currentTab,
			};

			if (action.currentTab !== undefined) {
				newState.currentTab = action.currentTab;
			}

			return newState;
		},
	},
);

export default inventoryReducer;
