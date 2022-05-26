import { KnitClient as Knit } from "@rbxts/knit";
import { profileBoardState } from "client/Rodux/Reducers/ProfileBoardReducer";

export const FetchBoardData = (player: Player) => {
	const ProfileService = Knit.GetService("ProfileService");
	const goldService = Knit.GetService("GoldService");
	const dbService = Knit.GetService("DatabaseService");
	const userGold = goldService.GetGold(player);
	const userStats = ProfileService.GetProfile(player);
	const userKDR = dbService.GetUserData(player);
	const userInfo: profileBoardState = {
		playerViewing: player,
		playerCoins: userGold,
		playerLevel: userStats.Level,
		playerExpCap: userStats.ExpCap,
		playerExp: userStats.Experience,
		playerWins: userKDR[1],
		playerDeaths: userKDR[2],
		playerKills: userKDR[0],
	};

	return userInfo;
};
