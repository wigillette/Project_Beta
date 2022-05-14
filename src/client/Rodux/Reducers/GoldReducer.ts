import Rodux from "@rbxts/rodux";

export interface goldState {
	Gold: number;
}

interface Action {
	type: string;
	payload?: { Gold: number };
}

export const goldReducer = Rodux.createReducer(
	{ Gold: 500 },
	{
		updateGold: (state: goldState, action: Action) => {
			const newState: goldState = { Gold: 500 };
			if (action.payload) {
				newState.Gold = action.payload.Gold;
			}
			return newState;
		},
	},
);
