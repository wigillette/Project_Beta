import Rodux from "@rbxts/rodux";
import { ReplicatedStorage } from "@rbxts/services";

// Models Folder:
const modelsFolder = ReplicatedStorage.WaitForChild("ModelsFolder", 10);

// Handles the state of the shop UI; toggle and items
export interface shopState {
	toggle: boolean;
	currentPack: string;
	vipToggle: boolean;
}

interface Action {
	// The action being called with the data from the server
	type: string;
	payload?: { pack: string };
}

export const INITIAL_STATE = { toggle: false, currentPack: "Alpha", vipToggle: false };

export const shopReducer = Rodux.createReducer(INITIAL_STATE, {
	toggleShop: (state: shopState) => {
		// Toggle the shop view
		return { toggle: !state.toggle, currentPack: state.currentPack, vipToggle: state.vipToggle };
	},
	switchPack: (state: shopState, action: Action) => {
		const newState = { ...state };

		if (action.payload) {
			newState.currentPack = action.payload.pack;
		}

		return newState;
	},
	toggleVIPShop: (state: shopState) => {
		const newState = { ...state };
		newState.vipToggle = !newState.vipToggle;

		return newState;
	},
});
