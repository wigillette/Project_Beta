import { KnitClient as Knit, KnitClient } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { profileBoardState } from "client/Rodux/Reducers/ProfileBoardReducer";

export const FetchBoardData = (player: Player) => {
	const ProfileService = Knit.GetService("ProfileService");
	const goldService = Knit.GetService("GoldService");
	const dbService = Knit.GetService("DatabaseService");
	const sessionService = Knit.GetService("SessionService");
	const userGold = goldService.GetGold(player);
	const userStats = ProfileService.GetProfile(player);
	const userKDR = dbService.GetUserData(player);
	const sessionKDR = sessionService.GetUserStats(player);
	let sessionKills = 0;
	let sessionDeaths = 0;
	let sessionWins = 0;
	if (sessionKDR) {
		sessionKills = sessionKDR.Kills;
		sessionDeaths = sessionKDR.Deaths;
		sessionWins = sessionKDR.Wins;
	}
	const userInfo: profileBoardState = {
		playerViewing: player,
		playerCoins: userGold,
		playerLevel: userStats.Level,
		playerExpCap: userStats.ExpCap,
		playerExp: userStats.Experience,
		playerWins: userKDR[1],
		playerDeaths: userKDR[2],
		playerKills: userKDR[0],
		sessionKills: sessionKills,
		sessionDeaths: sessionDeaths,
		sessionWins: sessionWins,
		players: Players.GetPlayers(),
		ownedBadges: [],
		allBadges: [],
		viewingBadges: false,
	};

	return userInfo;
};
