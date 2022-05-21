import Rodux from "@rbxts/rodux";

export interface bettingState {
	mode: string;
	choices: Player[] | string[];
	toggle: boolean;
	choice: Player | string;
	amount: number;
}

interface Action {
	type: string;
	payload?: { toggle: boolean; choices: Player[] | string[]; mode: string; choice: Player | string; amount: number };
}

export const bettingReducer = Rodux.createReducer(
	{ toggle: false, choices: [] as Player[] | string[], mode: "None", choice: "" as Player | string, amount: 0 },
	{
		updateBettingInfo: (state: bettingState, action: Action) => {
			const newState: bettingState = state;
			if (action.payload) {
				newState.choices = action.payload.choices;
				newState.mode = action.payload.mode;
				newState.toggle = action.payload.toggle;
			}
			return newState;
		},
		setBettingToggle: (state: bettingState, action: Action) => {
			const newState = state;

			if (action.payload) {
				newState.toggle = action.payload.toggle;
				if (!action.payload.toggle) {
					newState.choice = "";
				}
			}

			return newState;
		},
		toggleBetting: (state: bettingState) => {
			const newState: bettingState = {
				toggle: !state.toggle,
				choice: state.choice,
				choices: state.choices,
				mode: state.mode,
				amount: state.amount,
			};

			return newState;
		},
		selectItem: (state: bettingState, action: Action) => {
			const newState = state;

			if (action.payload) {
				newState.choice = action.payload.choice;
			}

			return newState;
		},
		updateBetAmount: (state: bettingState, action: Action) => {
			const newState = state;

			if (action.payload) {
				newState.amount = action.payload.amount;
			}

			return newState;
		},
	},
);
