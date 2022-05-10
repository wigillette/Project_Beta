import Roact from "@rbxts/roact";
import Card from "client/Components/Material/Card";
import { Players, Workspace } from "@rbxts/services";

// Run on client service startup
export default function init() {
	// Create the manager object

	const cardModel = Workspace.WaitForChild("PetExample") as Model;
	const cardObject = Roact.createElement(Card, {
		Text: "Title",
		ButtonText: "Click Here",
		Callback: () => {
			print("Clicked");
		},
		Model: cardModel,
	});

	const client = Players.LocalPlayer;
	const pg = client.WaitForChild("PlayerGui");
	const main = pg.WaitForChild("Main");

	Roact.mount(cardObject, main);
}
