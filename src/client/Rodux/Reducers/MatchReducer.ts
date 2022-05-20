import Rodux from "@rbxts/rodux";

// Handles the state of the match UI; toggle
export interface matchState {
	initialTime: number;
	modeName: string;
	mapName: string;
	aliveCounter: number;
}

interface Action {
	type: string;
	payload?: { initialTime: number; modeName: string; mapName: string; aliveCounter: number };
}

export const INITIAL_STATE = { initialTime: 0, modeName: "None", mapName: "None", aliveCounter: 0 };

export const matchReducer = Rodux.createReducer(INITIAL_STATE, {
	updateMatchInfo: (state: matchState, action: Action) => {
		// Toggle the match view
		let newState = state;

		if (action.payload) {
			newState = action.payload;
		}

		return newState;
	},
	updateAliveCounter: (state: matchState, action: Action) => {
		const newState = state;

		if (action.payload) {
			newState.aliveCounter = action.payload.aliveCounter;
		}

		return newState;
	},
});
