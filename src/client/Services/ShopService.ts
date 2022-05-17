import { KnitClient as Knit } from "@rbxts/knit";
import Store from "../Rodux/Store";
const ShopService = Knit.GetService("ShopService");

const ShopClient = {
	init: () => {
		print("Shop Service Initialized | Client");
	},
};

export default ShopClient;
