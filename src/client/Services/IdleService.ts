import { KnitClient } from "@rbxts/knit";
import { Players, UserInputService } from "@rbxts/services";
const IdleService = KnitClient.GetService("IdleService");

const IdleClient = {
	init: () => {
		UserInputService.WindowFocused.Connect(() => {
			if (Players.LocalPlayer.IsInGroup(5255599)) {
				IdleService.SendIdleEvent(false);
			}
		});

		UserInputService.WindowFocusReleased.Connect(() => {
			if (Players.LocalPlayer.IsInGroup(5255599)) {
				IdleService.SendIdleEvent(true);
			}
		});
	},
};

export default IdleClient;
