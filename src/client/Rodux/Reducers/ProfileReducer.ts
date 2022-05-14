import Rodux from "@rbxts/rodux";

export interface profileState {
	currentExp: number;
	maxExp: number;
}

interface Action {
	type: string;
	payload?: { currentExp: number; maxExp: number };
}

export const profileReducer = Rodux.createReducer(
	{ currentExp: 0, maxExp: 100 },
	{
		fetchExp: (state: profileState, action: Action) => {
			const newState: profileState = { currentExp: 0, maxExp: 100 };
			if (action.payload) {
				newState.currentExp = action.payload.currentExp;
				newState.maxExp = action.payload.maxExp;
			}
			return newState;
		},
	},
);
