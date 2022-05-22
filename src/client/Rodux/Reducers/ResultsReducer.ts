import Rodux from "@rbxts/rodux";
export interface playerResult {
	Player: Player;
	Kills: number;
	Deaths: number;
}
export interface ResultsState {
	toggle: boolean;
	playerResults: playerResult[];
	goldEarned: number;
	winner: string;
}

interface Action {
	type: string;
	payload?: { toggle: boolean; playerResults: playerResult[]; goldEarned: number; winner: string };
}

export const ResultsReducer = Rodux.createReducer(
	{ toggle: false, playerResults: [] as playerResult[], goldEarned: 0, winner: "None" },
	{
		updateResultsInfo: (state: ResultsState, action: Action) => {
			let newState: ResultsState = state;
			if (action.payload) {
				newState = action.payload;
			}
			return newState;
		},
		setResultsToggle: (state: ResultsState, action: Action) => {
			const newState = state;

			if (action.payload) {
				newState.toggle = action.payload.toggle;
			}

			return newState;
		},
		toggleResults: (state: ResultsState) => {
			const newState: ResultsState = {
				toggle: !state.toggle,
				playerResults: state.playerResults,
				goldEarned: state.goldEarned,
				winner: state.winner,
			};

			return newState;
		},
	},
);
