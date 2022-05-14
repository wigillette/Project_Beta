import { Players } from "@rbxts/services";
import { KnitClient as Knit } from "@rbxts/knit";
import Roact from "@rbxts/roact";
import Interaction from "client/Components/Interaction";

// Access the interaction service
const InteractionService = Knit.GetService("InteractionService");

interface InteractionField {
	Name: string;
	Message: string;
	Model: Model;
	Animation: string | undefined;
}

export default function init() {
	print("Interaction Service Initialized | Client");
	// Client Objects
	const client = Players.LocalPlayer;
	const pg = client.WaitForChild("PlayerGui");

	// Fetch the interactions from the server
	InteractionService.GetInteractionsPromise().then((interactionObjects: InteractionField[]) => {
		interactionObjects.forEach((interaction: InteractionField) => {
			const head = interaction.Model.WaitForChild("Head", 10);
			if (head) {
				// Setting up the proximity prompt
				const proximityPrompt =
					head.FindFirstChildOfClass("ProximityPrompt") || new Instance("ProximityPrompt", head);
				proximityPrompt.ObjectText = interaction.Name;
				proximityPrompt.KeyboardKeyCode = Enum.KeyCode.E;
				proximityPrompt.HoldDuration = 2;
				proximityPrompt.UIOffset = new Vector2(0, 80);

				// Play the animation and display the interaction UI when finished holding
				proximityPrompt.Triggered.Connect(() => {
					const hum = interaction.Model.FindFirstChildOfClass("Humanoid");
					const main = pg.WaitForChild("Main", 10);
					if (interaction.Animation !== undefined && hum) {
						// Set up the animation
						let anim = interaction.Model.FindFirstChildOfClass("Animation");
						if (!anim) {
							anim = new Instance("Animation");
							anim.Name = "Idle";
							anim.Parent = interaction.Model;
						}
						anim.AnimationId = interaction.Animation;
						const animTrack = hum.LoadAnimation(anim);
						animTrack.Play();

						// Create the interaction UI
						const newInteraction = Roact.createElement(Interaction, {
							Header: interaction.Name,
							Body: interaction.Message,
							Model: interaction.Model,
							Animation: interaction.Animation,
						});
						Roact.mount(newInteraction, main);
					}
				});
			}
		});
	});
}
