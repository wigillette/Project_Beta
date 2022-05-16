import { KnitClient as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { DR_FORMAT } from "shared/DailyRewardInfo";
import Store from "../Rodux/Store";
const DailyRewardService = Knit.GetService("DailyRewardService");
const DailyRewardClient = {
	StreakChanged: (drInfo: DR_FORMAT) => {
		Store.dispatch({
			type: "updateStreak",
			payload: { streak: drInfo.Streak, timeAmount: drInfo.TimeRemaining },
		});
	},
	ClaimReward: () => {
		DailyRewardService.ClaimReward();
	},
	init: () => {
		const initialStreak = DailyRewardService.GetStreak();
		DailyRewardClient.StreakChanged(initialStreak);
		DailyRewardService.StreakChanged.Connect(DailyRewardClient.StreakChanged);
		print("Daily Reward Service Initialized | Client");
	},
};

export default DailyRewardClient;
