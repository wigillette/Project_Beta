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

	// List of trigger parts and their corresponding Rodux action names
	const triggerHooks: TouchManager[] = [];

	locations.forEach((trigger) => {
		// Initialize each trigger
		const triggerPart = trigger[0] as BasePart | undefined;
		const action = trigger[1] as string | (() => void);
		const enterCallback = trigger[2] as (() => void) | undefined;
		const leaveCallback = trigger[3] as (() => void) | undefined;
		const conditionFunction = trigger[4] as (() => [boolean, string]) | undefined;
		if (triggerPart && action) {
			const triggerHook = new TouchManager(triggerPart, action, enterCallback, leaveCallback, conditionFunction);
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
