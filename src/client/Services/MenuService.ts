import Roact from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import Grid from "client/Components/Material/Grid";
import Textbox from "client/Components/Material/Textbox";
import Slider from "client/Components/Material/Slider";
import CircularProgress from "client/Components/Material/CircularProgress";
import ToggleButton from "client/Components/Material/ToggleButton";
// Run on client service startup
export default function init() {
	// Create the manager object

	//const cardModel = Workspace.WaitForChild("PetExample") as Model;
	/*
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
    */

	/*const textboxObject = Roact.createElement(Textbox, {
		placeholderText: "Enter your input..",
		Position: new UDim2(0.5, 0, 0.5, 0),
		Size: new UDim2(0.5, 0, 0.1, 0),
		AnchorPoint: new Vector2(0.5, 0.5),
		onEnter: (text: string) => {
			print(text);
		},
	});*/
	/*
	const sliderObject = Roact.createElement(Slider, {
		Title: "Slider Example",
		Size: new UDim2(0.25, 0, 0.07, 0),
		Position: new UDim2(0.5, 0, 0.5, 0),
		AnchorPoint: new Vector2(0.5, 0.5),
	});
	*/

	const progressObject = Roact.createElement(CircularProgress, {
		Position: new UDim2(0.5, 0, 0.5, 0),
		Size: new UDim2(0.125, 0, 0.125, 0),
		AnchorPoint: new Vector2(0.5, 0.5),
		Text: "Progress Example",
		Ratio: 0.75,
	});

	const toggleObject = Roact.createElement(ToggleButton, {
		Size: new UDim2(0.08, 0, 0.1, 0),
		Position: new UDim2(0.5, 0, 0.5, 0),
		AnchorPoint: new Vector2(0.5, 0.5),
		Title: "Toggle Example",
	});
	const client = Players.LocalPlayer;
	const pg = client.WaitForChild("PlayerGui");
	const main = pg.WaitForChild("Main");

	Roact.mount(progressObject, main);
}
