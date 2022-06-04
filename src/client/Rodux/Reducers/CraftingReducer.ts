import Rodux from "@rbxts/rodux";

interface Action {
	type: string;
	payload?: { newRarity: string; selectedSword: string };
}

export interface craftingState {
	toggle: boolean;
	currentRarity: string;
	selectedSwords: string[];
}

export const craftingReducer = Rodux.createReducer(
	{ toggle: false, currentRarity: "Common", selectedSwords: [] as string[] },
	{
		emptySelectedSwords: (state: craftingState, action: Action) => {
			const newState = { ...state };
			newState.selectedSwords.clear();
			return newState;
		},
		switchRarity: (state: craftingState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				newState.currentRarity = action.payload.newRarity;
				newState.selectedSwords.clear();
			}
			return newState;
		},
		selectSword: (state: craftingState, action: Action) => {
			const newState = { ...state };
			if (action.payload && !newState.selectedSwords.includes(action.payload.selectedSword)) {
				newState.selectedSwords.push(action.payload.selectedSword);
			}
			return newState;
		},
		removeSword: (state: craftingState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				const selectedSword = newState.selectedSwords.indexOf(action.payload.selectedSword);
				if (selectedSword !== -1) {
					newState.selectedSwords.remove(selectedSword);
				}
			}

			return newState;
		},
		toggleCrafting: (state: craftingState) => {
			const newState = { ...state };
			newState.toggle = !newState.toggle;
			if (!newState.toggle) {
				newState.selectedSwords.clear();
			}

			return newState;
		},
	},
);
