import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players, BadgeService } from "@rbxts/services";
import { badges, BADGE_FUNCTIONS } from "../../shared/Badges";

declare global {
	interface KnitServices {
		BadgeService: typeof BadgeService;
	}
}

const badgeService = Knit.CreateService({
	Name: "BadgeService",

	Client: {
		ChangeMusic: new RemoteSignal<(songName: string) => void>(),
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

	KnitInit() {
		Players.PlayerAdded.Connect((plr) => {
			BADGE_FUNCTIONS.CheckForOwner(plr);
		});
		print("Music Service Initialized | Server");
	},
});

export default badgeService;
