import Rodux from "@rbxts/rodux";

export interface playerListState {
	players: Player[];
}

interface Action {
	type: string;
	payload?: { players: Player[] };
}

export const playerListReducer = Rodux.createReducer(
	{ players: [] as Player[] },
	{
		updatePlayers: (state: playerListState, action: Action) => {
			const newState = state;
			if (action.payload) {
				newState.players = action.payload.players;
			}
			return newState;
		},
	},
);
