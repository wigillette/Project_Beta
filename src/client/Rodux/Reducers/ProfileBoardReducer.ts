import Rodux from "@rbxts/rodux";
import { Players } from "@rbxts/services";
import { FetchBoardData } from "client/Services/ProfileBoardService";

interface Action {
	type: string;
	payload?: {
		playerViewing: Player;
		playerExp: number;
		playerDeaths: number;
		playerKills: number;
		playerWins: number;
		playerLevel: number;
		playerCoins: number;
		playerExpCap: number;
	};
}

export interface profileBoardState {
	playerViewing: Player;
	playerExp: number;
	playerDeaths: number;
	playerKills: number;
	playerWins: number;
	playerLevel: number;
	playerCoins: number;
	playerExpCap: number;
}

const clientProfile = FetchBoardData(Players.LocalPlayer);

export const profileBoardReducer = Rodux.createReducer(
	{
		playerViewing: Players.LocalPlayer,
		playerExp: clientProfile.playerExp,
		playerLevel: clientProfile.playerLevel,
		playerKills: clientProfile.playerKills,
		playerDeaths: clientProfile.playerDeaths,
		playerWins: clientProfile.playerWins,
		playerCoins: clientProfile.playerCoins,
		playerExpCap: clientProfile.playerExpCap,
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
				newState.playerCoins = action.payload.playerCoins;
				newState.playerExpCap = action.payload.playerExpCap;
			}
			return newState;
		},
	},
);