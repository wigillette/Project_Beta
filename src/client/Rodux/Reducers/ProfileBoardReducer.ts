import Rodux from "@rbxts/rodux";
import { KnitClient } from "@rbxts/knit";
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
		playerTickets: number;
		sessionKills: number;
		sessionWins: number;
		sessionDeaths: number;
		players: Player[];
		ownedBadges: BadgeInfo[];
		allBadges: BadgeInfo[];
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
	playerTickets: number;
	sessionKills: number;
	sessionWins: number;
	sessionDeaths: number;
	players: Player[];
	ownedBadges: BadgeInfo[];
	allBadges: BadgeInfo[];
	viewingBadges: boolean;
}

const badgeService = KnitClient.GetService("badgeService");
const clientProfile = FetchBoardData(Players.LocalPlayer);
const badgeInfo = badgeService.GetBadges(Players.LocalPlayer);

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
		sessionKills: clientProfile.sessionKills,
		sessionWins: clientProfile.sessionWins,
		sessionDeaths: clientProfile.sessionDeaths,
		playerTickets: clientProfile.playerTickets,
		players: Players.GetPlayers(),
		ownedBadges: badgeInfo[1] as BadgeInfo[],
		allBadges: badgeInfo[0] as BadgeInfo[],
		viewingBadges: false,
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
				newState.sessionDeaths = action.payload.sessionDeaths;
				newState.sessionKills = action.payload.sessionKills;
				newState.sessionWins = action.payload.sessionWins;
				newState.playerTickets = action.payload.playerTickets;
			}
			return newState;
		},
		getPlayers: (state: profileBoardState, action: Action) => {
			const newState: profileBoardState = { ...state };
			if (action.payload) {
				newState.players = action.payload.players;
			}
			return newState;
		},
		getBadges: (state: profileBoardState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				newState.allBadges = action.payload.allBadges;
				newState.ownedBadges = action.payload.ownedBadges;
			}

			return newState;
		},
		viewBadges: (state: profileBoardState, action: Action) => {
			const newState = { ...state };
			newState.viewingBadges = !newState.viewingBadges;

			return newState;
		},
	},
);
