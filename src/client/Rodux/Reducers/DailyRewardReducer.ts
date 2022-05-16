import Rodux from "@rbxts/rodux";

// Handles the state of the dailyReward UI; toggle
export interface dailyRewardState {
	toggle: boolean;
	streak: number;
	timeAmount: number;
}

interface Action {
	type: string;
	payload?: { streak: number; timeAmount: number };
}

export const INITIAL_STATE = { toggle: false, streak: 0, timeAmount: 0 };

export const dailyRewardReducer = Rodux.createReducer(INITIAL_STATE, {
	toggleDailyReward: (state: dailyRewardState) => {
		// Toggle the dailyReward view
		return { toggle: !state.toggle, streak: state.streak, timeAmount: state.timeAmount };
	},
	updateStreak: (state: dailyRewardState, action: Action) => {
		const newState = state;

		if (action.payload) {
			newState.streak = action.payload.streak;
			newState.timeAmount = action.payload.timeAmount;
		}

		return newState;
	},
});
