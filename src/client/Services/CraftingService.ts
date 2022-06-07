import { StarterGui } from "@rbxts/services";
import { KnitClient as Knit } from "@rbxts/knit";
import { googleMaterial } from "client/UIProperties/ColorSchemes";
import store from "client/Rodux/Store";
const CraftingService = Knit.GetService("CraftingService");

const CraftingClient = {
	ResetSelection() {
		store.dispatch({
			type: "resetSelection",
		});
	},
	init() {
		CraftingService.ResetSelection.Connect(() => {});
		print("Chat Service Initialized | Client");
	},
};

export default CraftingClient;
