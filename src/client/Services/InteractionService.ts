import InteractionManager from "client/Controllers/InteractionManager";
import { Workspace, Players, RunService } from "@rbxts/services";

export default function init() {
	// Client Objects
	const client = Players.LocalPlayer;

	// List of trigger parts and their corresponding UIs
	const NPCInteractions = [
		{
			Name: "Potion Brewer",
			Message: "Behold my wares!",
			Model: Workspace.WaitForChild("Dummy"),
			Animation: "rbxassetid://9606255387",
		},
	];

	const NPCInteractionObjects: InteractionManager[] = [];

	NPCInteractions.forEach((interaction) => {
		// Initialize each trigger
		const interactionObject = new InteractionManager(
			interaction.Name,
			interaction.Message,
			interaction.Model as Model,
			interaction.Animation,
		);
		NPCInteractionObjects.push(interactionObject);
	});

	// Check the triggers on every frame
	RunService.RenderStepped.Connect((dt) => {
		const character = client.Character;
		if (character) {
			NPCInteractionObjects.forEach((interactionObject) => {
				const withinRange = interactionObject.isWithinRange();
				if (withinRange) {
					interactionObject.initInputConnection();
				} else {
					interactionObject.endInputConnection();
				}
			});
		}
	});
}
