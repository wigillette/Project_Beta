import Roact from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import Grid from "client/Components/Material/Grid";

// Run on client service startup
export default function init() {
	// Create the manager object

	const cardModel = Workspace.WaitForChild("PetExample") as Model;
	const cardObject = Roact.createElement(Grid, {
		Header: "Pet Shop",
		CardInfo: [
			{ Name: "Pet 1", Price: 50, Model: cardModel },
			{ Name: "Pet 2", Price: 100, Model: cardModel },
			{ Name: "Pet 3", Price: 150, Model: cardModel },
			{ Name: "Pet 4", Price: 200, Model: cardModel },
			{ Name: "Pet 5", Price: 250, Model: cardModel },
			{ Name: "Pet 6", Price: 50, Model: cardModel },
			{ Name: "Pet 7", Price: 100, Model: cardModel },
			{ Name: "Pet 8", Price: 150, Model: cardModel },
			{ Name: "Pet 9", Price: 200, Model: cardModel },
			{ Name: "Pet 10", Price: 250, Model: cardModel },
			{ Name: "Pet 11", Price: 50, Model: cardModel },
			{ Name: "Pet 12", Price: 100, Model: cardModel },
			{ Name: "Pet 13", Price: 150, Model: cardModel },
			{ Name: "Pet 14", Price: 200, Model: cardModel },
			{ Name: "Pet 15", Price: 250, Model: cardModel },
		],
	});

	const client = Players.LocalPlayer;
	const pg = client.WaitForChild("PlayerGui");
	const main = pg.WaitForChild("Main");

	Roact.mount(cardObject, main);
}
