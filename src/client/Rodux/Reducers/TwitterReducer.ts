import Rodux from "@rbxts/rodux";

// Handles the state of the twitter UI; toggle
export interface twitterState {
	toggle: boolean;
}

interface Action {
	type: string;
	payload?: { toggle: boolean };
}

export const INITIAL_STATE = { toggle: false };

export const twitterReducer = Rodux.createReducer(INITIAL_STATE, {
	toggleTwitter: (state: twitterState) => {
		// Toggle the twitter view
		return { toggle: !state.toggle };
	},
	setTwitterToggle: (state: twitterState, action: Action) => {
		const newState = state;

		if (action.payload) {
			newState.toggle = action.payload.toggle;
		}

		return newState;
	},
});
