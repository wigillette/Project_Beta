import TouchManager from "client/Controllers/TouchManager";
import { Players, RunService } from "@rbxts/services";
import { locations } from "../../shared/LocationLinks";
import { KnitClient } from "@rbxts/knit";
import { pushNotification } from "./SnackbarService";

export default function init() {
	print("Touch Service Initialized | Client");
	// Client Objects
	const MatchService = KnitClient.GetService("MatchService");
	const client = Players.LocalPlayer;
	const pg = client.WaitForChild("PlayerGui");
	const main = pg.WaitForChild("Main");

	// List of trigger parts and their corresponding Rodux action names
	const triggerHooks: TouchManager[] = [];

	locations.forEach((trigger) => {
		// Initialize each trigger
		const triggerPart = trigger[0] as BasePart;
		const action = trigger[1] as string;
		if (triggerPart && action) {
			const triggerHook = new TouchManager(triggerPart, action);
			triggerHooks.push(triggerHook);
		}
	});

	// Check the triggers on every frame
	RunService.RenderStepped.Connect((dt) => {
		const character = client.Character;
		if (character) {
			triggerHooks.forEach((hook) => {
				const withinRange = hook.isWithinRange();
				if (withinRange) {
					const canAccess = MatchService.CanAccess();
					if (!canAccess[0] || canAccess[1]) {
						hook.displayUI();
					} else {
						hook.hideUI();
						//pushNotification(`Cannot access during the round`);
					}
				} else {
					hook.hideUI();
				}
			});
		}
	});
}
