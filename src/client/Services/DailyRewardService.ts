import { KnitClient as Knit } from "@rbxts/knit";
import { SoundService, Workspace } from "@rbxts/services";
import { DR_FORMAT } from "shared/DailyRewardInfo";
import Store from "../Rodux/Store";
const DailyRewardService = Knit.GetService("DailyRewardService");
const chest = Workspace.WaitForChild("StandardChest") as Model;
const sfxFolder = SoundService.WaitForChild("SFX");
const ANIMATION_IDS = {
	spin: 9870921161,
	shake: 9870469927,
};

const ANIMATION_NAMES = {
	spin: "ChestOpen",
	shake: "ChestClose",
};

const CHEST_SFX = {
	spin: sfxFolder.WaitForChild("ChestOpen") as Sound,
	shake: sfxFolder.WaitForChild("ChestShake") as Sound,
};

const DailyRewardClient = {
	StreakChanged: (drInfo: DR_FORMAT) => {
		Store.dispatch({
			type: "updateStreak",
			payload: { streak: drInfo.Streak, timeAmount: drInfo.TimeRemaining },
		});
	},
	PlayChestAnimation: (animationType: string) => {
		if (animationType in ANIMATION_IDS && animationType in ANIMATION_NAMES && animationType in CHEST_SFX) {
			const animation =
				(chest.FindFirstChild(
					ANIMATION_NAMES[animationType as keyof typeof ANIMATION_NAMES],
					true,
				) as Animation) || new Instance("Animation");
			animation.AnimationId = `rbxassetid://${ANIMATION_IDS[animationType as keyof typeof ANIMATION_IDS]}`;
			animation.Name = ANIMATION_NAMES[animationType as keyof typeof ANIMATION_NAMES];
			animation.Parent = chest;
			const animationController =
				chest.FindFirstChildOfClass("AnimationController") || new Instance("AnimationController");
			animationController.Parent = chest;
			const animationTrack = animationController.LoadAnimation(animation);
			animationTrack.Play();
			CHEST_SFX[animationType as keyof typeof CHEST_SFX].Play();

			const connection = animationTrack.Stopped.Connect(() => {
				connection.Disconnect();
			});
		}
	},
	ClaimReward: () => {
		const canClaim = DailyRewardService.ClaimReward();
		DailyRewardClient.PlayChestAnimation((canClaim && "spin") || "shake");
	},
	init: () => {
		const initialStreak = DailyRewardService.GetStreak();
		DailyRewardClient.StreakChanged(initialStreak);
		DailyRewardService.StreakChanged.Connect(DailyRewardClient.StreakChanged);
		print("Daily Reward Service Initialized | Client");
	},
};

export default DailyRewardClient;
