import TouchManager from "client/Controllers/TouchManager";
import { Workspace, Players, RunService } from "@rbxts/services";

export default function init() {
	// Client Objects
	const client = Players.LocalPlayer;
	const pg = client.WaitForChild("PlayerGui");
	const main = pg.WaitForChild("Main");

	// List of trigger parts and their corresponding Rodux action names
	const triggers = [[Workspace.WaitForChild("Location"), "toggleShop"]];
	const triggerHooks: TouchManager[] = [];

	triggers.forEach((trigger) => {
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
					hook.displayUI();
				} else {
					hook.hideUI();
				}
			});
		}
	});
}
