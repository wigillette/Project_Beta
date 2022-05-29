import Rodux from "@rbxts/rodux";
import { Players } from "@rbxts/services";

export interface spectateState {
	participants: Player[];
	playerViewing: Player;
	toggle: boolean;
}

interface Action {
	type: string;
	payload?: spectateState;
}

export const spectateReducer = Rodux.createReducer(
	{ participants: [] as Player[], playerViewing: Players.LocalPlayer, toggle: false },
	{
		switchSpectating: (state: spectateState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				newState.playerViewing = action.payload.playerViewing;
			}
			return newState;
		},
		updateParticipants: (state: spectateState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				newState.participants = action.payload.participants;
			}
			return newState;
		},
		toggleSpectate: (state: spectateState, action: Action) => {
			const newState = { ...state };
			newState.toggle = !newState.toggle;
			if (!newState.toggle) {
				newState.playerViewing = Players.LocalPlayer;
			}
			return newState;
		},
	},
);
