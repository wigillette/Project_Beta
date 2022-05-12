import Rodux from "@rbxts/rodux";
import ObjectUtils from "@rbxts/object-utils";
import { ReplicatedStorage } from "@rbxts/services";

// Models Folder:
const modelsFolder = ReplicatedStorage.WaitForChild("ModelsFolder", 10);

// Handles the state of the shop UI; toggle and items
export interface shopState {
	toggle: boolean;
	items: Map<string, { Price: number; Model: Model | Tool }>;
}

interface Action {
	// The action being called with the data from the server
	type: string;
	payload?: { items: Map<string, number> };
}

export const INITIAL_STATE = { toggle: false, items: new Map<string, { Price: number; Model: Model | Tool }>() };

export const shopReducer = Rodux.createReducer(INITIAL_STATE, {
	toggleShop: (state: shopState) => {
		// Toggle the shop view
		return { toggle: !state.toggle, items: state.items };
	},
	fetchItems: (state: shopState, action: Action) => {
		// Default: Use the state's items if there is an error with the server
		const toReturn = { toggle: state.toggle, items: state.items };

		// If the action has a payload (server data), store that data in items
		if (action.payload && modelsFolder) {
			let item;

			// Search for the models in the models folder
			const newMap = new Map<string, { Price: number; Model: Model | Tool }>();

			// Create a duplicate map, storing the models and their respective prices
			ObjectUtils.entries(action.payload.items).forEach((entry) => {
				item = modelsFolder.FindFirstChild(entry[0]) as Model | Tool;
				if (item) {
					newMap.set(entry[0], { Price: entry[1], Model: item });
				}
			});
			toReturn.items = newMap;
		}

		return toReturn;
	},
});
