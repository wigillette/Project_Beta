import Rodux from "@rbxts/rodux";

// Handles the state of the twitter UI; toggle
export interface twitterState {
	toggle: boolean;
}

export const INITIAL_STATE = { toggle: false };

export const twitterReducer = Rodux.createReducer(INITIAL_STATE, {
	toggleTwitter: (state: twitterState) => {
		// Toggle the twitter view
		return { toggle: !state.toggle };
	},
});
