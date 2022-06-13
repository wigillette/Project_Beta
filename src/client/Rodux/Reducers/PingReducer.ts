import Rodux from "@rbxts/rodux";
import { Players } from "@rbxts/services";

export interface pingState {
	ping: number;
}

interface Action {
	type: string;
	payload?: pingState;
}

export const pingReducer = Rodux.createReducer(
	{ ping: 0 },
	{
		updatePing: (state: pingState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				newState.ping = action.payload.ping;
			}
			return newState;
		},
	},
);
