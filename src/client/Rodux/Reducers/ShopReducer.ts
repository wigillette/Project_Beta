import Rodux from "@rbxts/rodux";
import { ReplicatedStorage } from "@rbxts/services";

// Models Folder:
const modelsFolder = ReplicatedStorage.WaitForChild("ModelsFolder", 10);

// Handles the state of the shop UI; toggle and items
export interface shopState {
	toggle: boolean;
	currentPack: string;
}

interface Action {
	// The action being called with the data from the server
	type: string;
	payload?: { pack: string };
}

export const INITIAL_STATE = { toggle: false, currentPack: "Alpha" };

export const shopReducer = Rodux.createReducer(INITIAL_STATE, {
	toggleShop: (state: shopState) => {
		// Toggle the shop view
		return { toggle: !state.toggle, currentPack: state.currentPack };
	},
	switchPack: (state: shopState, action: Action) => {
		const newState = state;

		if (action.payload) {
			newState.currentPack = action.payload.pack;
		}

		return newState;
	},
});
