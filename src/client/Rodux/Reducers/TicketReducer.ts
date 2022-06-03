import Rodux from "@rbxts/rodux";

interface Action {
	type: string;
	payload?: { ticketAmount: number };
}

export interface ticketState {
	ticketAmount: number;
}

export const ticketReducer = Rodux.createReducer(
	{ ticketAmount: 0 },
	{
		getTickets: (state: ticketState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				newState.ticketAmount = action.payload.ticketAmount;
			}
			return newState;
		},
	},
);
