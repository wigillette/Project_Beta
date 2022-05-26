import Rodux from "@rbxts/rodux";
import { Players } from "@rbxts/services";
import { PROFILE_FORMAT, INITIAL_STATS } from "shared/LevelInfo";

interface Action {
	type: string;
	payload?: {
		playerViewing: Player;
		playerExp: number;
		playerDeaths: number;
		playerKills: number;
		playerWins: number;
		playerLevel: number;
	};
}

export interface profileBoardState {
	playerViewing: Player;
	playerExp: number;
	playerDeaths: number;
	playerKills: number;
	playerWins: number;
	playerLevel: number;
}

export const profileReducer = Rodux.createReducer(
	{
		playerViewing: Players.LocalPlayer,
		playerExp: 0,
		playerLevel: 1,
		playerKills: 0,
		playerDeaths: 0,
		playerWins: 0,
	},
	{
		switchProfile: (state: profileBoardState, action: Action) => {
			const newState: profileBoardState = { ...state };
			if (action.payload) {
				newState.playerDeaths = action.payload.playerDeaths;
				newState.playerKills = action.payload.playerKills;
				newState.playerWins = action.payload.playerWins;
				newState.playerLevel = action.payload.playerLevel;
				newState.playerExp = action.payload.playerExp;
				newState.playerViewing = action.payload.playerViewing;
			}
			return newState;
		},
	},
);
