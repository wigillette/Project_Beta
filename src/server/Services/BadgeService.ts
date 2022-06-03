import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players, BadgeService } from "@rbxts/services";
import { badges, BADGE_FUNCTIONS, badgeInformation } from "../../shared/Badges";

declare global {
	interface KnitServices {
		badgeService: typeof badgeService;
	}
}

const badgeService = Knit.CreateService({
	Name: "badgeService",

	Client: {
		GetBadges(client: Player, player: Player) {
			return this.Server.GetOwnedBadges(player);
		},
	},

	GetBadges(player: Player) {
		const userBadges = [] as number[];
		pcall(() => {
			badges.forEach((badge) => {
				if (BadgeService.UserHasBadgeAsync(player.UserId, badge)) {
					userBadges.push(badge);
				}
			});
		});
		return userBadges;
	},

	UserHasBadge(player: Player, badge: number) {
		const userBadges = this.GetBadges(player);
		return userBadges.includes(badge);
	},

	GetOwnedBadges(player: Player) {
		const badges = this.GetBadges(player);
		const ownedBadges = [] as number[];

		badges.forEach((badge) => {
			if (BadgeService.UserHasBadgeAsync(player.UserId, badge)) {
				ownedBadges.push(badge);
			}
		});

		const fullBadgeInfo = badgeInformation.map((badge) => {
			return badge[1] as BadgeInfo;
		});

		const ownedBadgesTags = badgeInformation.filter((badgeInfo) => {
			return ownedBadges.includes(badgeInfo[0] as number);
		});

		const ownedBadgesInfo = ownedBadgesTags.map((badge) => {
			return badge[1] as BadgeInfo;
		});

		return [fullBadgeInfo, ownedBadgesInfo];
	},

	KnitInit() {
		Players.PlayerAdded.Connect((plr) => {
			BADGE_FUNCTIONS.CheckForOwner(plr);
		});
		print("Badge Service Initialized | Server");
	},
});

export default badgeService;
