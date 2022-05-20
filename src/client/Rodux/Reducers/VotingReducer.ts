import Rodux from "@rbxts/rodux";

export interface votingState {
	maps: string[];
	modes: string[];
	toggle: boolean;
	chosenMode: string;
	chosenMap: string;
}

interface Action {
	type: string;
	payload?: { toggle: boolean; maps: string[]; modes: string[]; chosenMode: string; chosenMap: string };
}

export const votingReducer = Rodux.createReducer(
	{ toggle: false, maps: [] as string[], modes: [] as string[], chosenMode: "", chosenMap: "" },
	{
		updateVotingOptions: (state: votingState, action: Action) => {
			const newState: votingState = state;
			if (action.payload) {
				newState.maps = action.payload.maps;
				newState.modes = action.payload.modes;
				newState.toggle = action.payload.toggle;
			}
			return newState;
		},
		setVotingToggle: (state: votingState, action: Action) => {
			const newState = state;

			if (action.payload) {
				newState.toggle = action.payload.toggle;
			}

			return newState;
		},
		setChosenMap: (state: votingState, action: Action) => {
			const newState: votingState = state;
			if (action.payload) {
				newState.chosenMap = action.payload.chosenMap;
			}
			return newState;
		},
		setChosenMode: (state: votingState, action: Action) => {
			const newState: votingState = state;
			if (action.payload) {
				newState.chosenMode = action.payload.chosenMode;
			}
			return newState;
		},
	},
);
