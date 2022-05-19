import Rodux from "@rbxts/rodux";
export interface playerResult {
	Player: Player;
	Kills: number;
	Deaths: number;
}
export interface ResultsState {
	toggle: boolean;
	expEarned: number;
	playerResults: playerResult[];
	goldEarned: number;
}

interface Action {
	type: string;
	payload?: { toggle: boolean; expEarned: number; playerResults: playerResult[]; goldEarned: number };
}

export const ResultsReducer = Rodux.createReducer(
	{ toggle: false, expEarned: 0, playerResults: [] as playerResult[], goldEarned: 0 },
	{
		updateResultsInfo: (state: ResultsState, action: Action) => {
			const newState: ResultsState = state;
			if (action.payload) {
				newState.playerResults = action.payload.playerResults;
				newState.goldEarned = action.payload.goldEarned;
				newState.expEarned = action.payload.expEarned;
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
				expEarned: state.expEarned,
				playerResults: state.playerResults,
				goldEarned: state.goldEarned,
			};

			return newState;
		},
	},
);
