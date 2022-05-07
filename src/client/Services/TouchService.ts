import TouchManager from "client/Controllers/TouchManager";
import { Workspace, Players, RunService } from "@rbxts/services";

export default function init() {
	// Client Objects
	const client = Players.LocalPlayer;
	const pg = client.WaitForChild("PlayerGui");
	const main = pg.WaitForChild("Main");

	// List of trigger parts and their corresponding UIs
	const triggers = [[Workspace.WaitForChild("Location"), main.WaitForChild("PersonList")]];
	const triggerHooks: TouchManager[] = [];

	triggers.forEach((trigger) => {
		// Initialize each trigger
		const triggerPart = trigger[0] as BasePart;
		const triggerUI = trigger[1] as Frame;
		if (triggerPart && triggerUI) {
			const triggerHook = new TouchManager(triggerPart, triggerUI);
			triggerHooks.push(triggerHook);
		}
	});

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
