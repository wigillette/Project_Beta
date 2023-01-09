import { KnitClient } from "@rbxts/knit";
import { Players, UserInputService } from "@rbxts/services";
import store from "client/Rodux/Store";
const IdleService = KnitClient.GetService("IdleService");

const IdleClient = {
	loadPlayer: () => {
		IdleService.LoadPlayer();
	},
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

		spawn(() => {
			wait(0.5);
			let time = 0;
			let dt = 0;
			while (Players.LocalPlayer) {
				time = tick();
				IdleService.UpdatePing();
				dt = math.ceil((tick() - time) * 1000);
				store.dispatch({ type: "updatePing", payload: { ping: dt } });
				wait(1);
			}
		});
	},
};

export default IdleClient;
