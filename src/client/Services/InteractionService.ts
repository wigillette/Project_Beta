import InteractionManager from "client/Controllers/InteractionManager";
import { Players, RunService } from "@rbxts/services";
import { KnitClient as Knit } from "@rbxts/knit";

// Access the person service
const InteractionService = Knit.GetService("InteractionService");

interface Interaction {
	Name: string;
	Message: string;
	Model: Model;
	Animation: string | undefined;
}

export default function init() {
	print("Interaction Service Initialized | Client");
	// Client Objects
	const client = Players.LocalPlayer;

	// Fetch the interactions from the server
	InteractionService.GetInteractionsPromise().then((interactionObjects: Interaction[]) => {
		const NPCInteractionObjects: InteractionManager[] = [];

		interactionObjects.forEach((interaction: Interaction) => {
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
	});
}
