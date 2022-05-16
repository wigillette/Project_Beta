import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import { DR_FORMAT, INITIAL_DR, REWARD_VALUES } from "shared/DailyRewardInfo";
import { GoldService } from "./GoldService";
import SnackbarService from "./SnackbarService";

declare global {
	interface KnitServices {
		DailyRewardService: typeof DailyRewardService;
	}
}

export const DailyRewardService = Knit.CreateService({
	Name: "DailyRewardService",

	// Server-exposed Signals/Fields
	PlayerDailyReward: new Map<Player, DR_FORMAT>(),

	Client: {
		StreakChanged: new RemoteSignal<(drInfo: DR_FORMAT) => void>(),
		GetStreak(Player: Player) {
			return this.Server.GetDRInfo(Player);
		},
		ClaimReward(Player: Player) {
			this.Server.ClaimReward(Player);
		},
	},

	ClaimReward(Player: Player) {
		const DRInfo = this.GetDRInfo(Player);
		DRInfo.TimeRemaining = 86400 - (os.time() - DRInfo.PreviouslyClaimed);
		if (DRInfo.TimeRemaining <= 0) {
			// Add the reward
			let day = math.min(DRInfo.Streak, 4);
			day = math.max(day, 1);
			const reward = REWARD_VALUES[day as keyof typeof REWARD_VALUES];
			GoldService.AddGold(Player, reward);

			// Update the streak and claimed time
			DRInfo.Streak += 1;
			DRInfo.PreviouslyClaimed = os.time();
			DRInfo.TimeRemaining = 86400 - (os.time() - DRInfo.PreviouslyClaimed);

			// Update database and view
			this.PlayerDailyReward.set(Player, DRInfo);
			this.Client.StreakChanged.Fire(Player, DRInfo);
			this.UpdateDailyRewardData(Player, DRInfo);
			SnackbarService.PushPlayer(Player, `You have received ${reward} gold!`);
		} else {
			SnackbarService.PushPlayer(Player, `You have ${DRInfo.TimeRemaining} seconds remaining!`);
		}
	},

	GetDRInfo(Player: Player) {
		const DailyReward = this.PlayerDailyReward.get(Player);
		return DailyReward ?? INITIAL_DR;
	},

	UpdateDailyRewardData(Player: Player, newDailyReward: DR_FORMAT) {
		const DailyRewardStore = Database("DailyReward", Player);
		DailyRewardStore.Set(newDailyReward);
	},

	InitData(Player: Player, DailyReward: DR_FORMAT) {
		DailyReward.TimeRemaining = 86400 - (os.time() - DailyReward.PreviouslyClaimed);
		this.PlayerDailyReward.set(Player, DailyReward);
		this.Client.StreakChanged.Fire(Player, DailyReward);
	},

	KnitInit() {
		print("Daily Reward Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => this.PlayerDailyReward.delete(player));
	},
});
