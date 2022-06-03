import { KnitClient as Knit, KnitClient } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { profileBoardState } from "client/Rodux/Reducers/ProfileBoardReducer";

export const FetchBoardData = (player: Player) => {
	const ProfileService = Knit.GetService("ProfileService");
	const goldService = Knit.GetService("GoldService");
	const sessionService = Knit.GetService("SessionService");
	const ticketService = Knit.GetService("ArenaTicketService");
	const userGold = goldService.GetGold(player);
	const userStats = ProfileService.GetProfile(player);
	const userKDR = sessionService.GetUserStats(player);
	const sessionKDR = userKDR[0];
	const globalKDR = userKDR[1];
	const playerTickets = ticketService.GetTickets(player);
	let sessionKills = 0;
	let sessionDeaths = 0;
	let sessionWins = 0;
	if (sessionKDR) {
		sessionKills = sessionKDR.Kills;
		sessionDeaths = sessionKDR.Deaths;
		sessionWins = sessionKDR.Wins;
	}
	let globalKills = 0;
	let globalDeaths = 0;
	let globalWins = 0;
	if (globalKDR) {
		globalKills = globalKDR.Kills;
		globalDeaths = globalKDR.Deaths;
		globalWins = globalKDR.Wins;
	}

	const userInfo: profileBoardState = {
		playerViewing: player,
		playerCoins: userGold,
		playerLevel: userStats.Level,
		playerExpCap: userStats.ExpCap,
		playerExp: userStats.Experience,
		playerWins: globalWins,
		playerDeaths: globalDeaths,
		playerKills: globalKills,
		sessionKills: sessionKills,
		sessionDeaths: sessionDeaths,
		sessionWins: sessionWins,
		playerTickets: playerTickets,
		players: Players.GetPlayers(),
		ownedBadges: [],
		allBadges: [],
		viewingBadges: false,
	};

	return userInfo;
};
