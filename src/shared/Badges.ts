import { KnitServer } from "@rbxts/knit";
import { BadgeService, Players } from "@rbxts/services";

export const badges = [
	2124512464, 2124512467, 2124512890, 2124512465, 2124512468, 2124512469, 2124512891, 2124512460, 2124512470,
	2124512466, 2124512892, 2124512471, 2124512463, 2124512472, 2124512893, 2124512461, 2124512473, 2124512916,
];

export const BADGE_GOLD = {
	2124512916: 50,
	2124512464: 5,
	2124512465: 10,
	2124512460: 75,
	2124512466: 450,
	2124512463: 850,
	2124512461: 3000,
	2124512467: 10,
	2124512468: 30,
	2124512469: 85,
	2124512470: 250,
	2124512471: 500,
	2124512472: 1000,
	2124512473: 2500,
	2124512890: 15,
	2124512891: 50,
	2124512892: 120,
	2124512893: 350,
};

export const KILL_BADGES = {
	"1": 2124512464,
	"10": 2124512465,
	"100": 2124512460,
	"500": 2124512466,
	"1000": 2124512463,
	"5000": 2124512461,
};

export const WIN_BADGES = {
	"1": 2124512467,
	"10": 2124512468,
	"25": 2124512469,
	"50": 2124512470,
	"100": 2124512471,
	"250": 2124512472,
	"500": 2124512473,
};

export const LEVEL_BADGES = {
	"5": 2124512890,
	"10": 2124512891,
	"15": 2124512892,
	"20": 2124512893,
};

const postBadge = (plr: Player, badgeId: number) => {
	const chatService = KnitServer.GetService("ChatService");
	const badgeInfo = BadgeService.GetBadgeInfoAsync(badgeId);
	const badgeGold = BADGE_GOLD[badgeId as keyof typeof BADGE_GOLD];
	chatService.PostAllFeedback(`${plr.Name} has earned the ${badgeInfo.Name} badge and received ${badgeGold} gold!`);
};

const awardBadge = (plr: Player, badgeId: number) => {
	postBadge(plr, badgeId);
	const goldService = KnitServer.GetService("GoldService");
	if (!BadgeService.UserHasBadgeAsync(plr.UserId, badgeId) && badgeId in BADGE_GOLD) {
		const badgeGold = BADGE_GOLD[badgeId as keyof typeof BADGE_GOLD];
		BadgeService.AwardBadge(plr.UserId, badgeId);
		goldService.AddGold(plr, badgeGold);
	}
};

export const BADGE_FUNCTIONS = {
	CheckForOwner: (plr: Player) => {
		const isOwner = plr.UserId === 75395624 || plr.UserId === 125779211;
		if (isOwner) {
			Players.GetPlayers().forEach((player) => {
				awardBadge(player, 2124512916);
			});
		} else {
			const userIds = Players.GetPlayers().map((player) => {
				return player.UserId;
			});
			const ownerInServer = userIds.includes(75395624) || userIds.includes(125779211);
			if (ownerInServer) {
				awardBadge(plr, 2124512916);
			}
		}
	},
	CheckForWinBadges(plr: Player, winAmt: number) {
		if (tostring(winAmt) in WIN_BADGES) {
			const badgeId = WIN_BADGES[tostring(winAmt) as keyof typeof WIN_BADGES];
			awardBadge(plr, badgeId);
		}
	},
	CheckForKillBadges(plr: Player, killAmt: number) {
		if (tostring(killAmt) in KILL_BADGES) {
			const badgeId = KILL_BADGES[tostring(killAmt) as keyof typeof KILL_BADGES];
			awardBadge(plr, badgeId);
		}
	},
	CheckForLevelBadges(plr: Player, level: number) {
		if (tostring(level) in LEVEL_BADGES) {
			const badgeId = LEVEL_BADGES[tostring(level) as keyof typeof LEVEL_BADGES];
			awardBadge(plr, badgeId);
		}
	},
};
