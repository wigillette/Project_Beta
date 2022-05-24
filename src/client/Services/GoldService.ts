import { KnitClient as Knit } from "@rbxts/knit";
import { itemsFormat, productFormat } from "client/Rodux/Reducers/GoldReducer";
import Store from "../Rodux/Store";
const GoldService = Knit.GetService("GoldService");
const GoldClient = {
	GoldChanged: (Gold: number) => {
		Store.dispatch({
			type: "updateGold",
			payload: { Gold: Gold },
		});
	},
	FetchProducts: (items: itemsFormat) => {
		Store.dispatch({
			type: "fetchProducts",
			payload: { items: items },
		});
	},
	init: () => {
		const initialGold = GoldService.GetGold();
		GoldClient.GoldChanged(initialGold);
		GoldService.GoldChanged.Connect(GoldClient.GoldChanged);
		GoldService.GetProductsPromise()
			.then((items) => {
				const page = items as itemsFormat;
				GoldClient.FetchProducts(page);
			})
			.catch((err) => {
				print(err);
				print("Failed to load products.");
			});
		print("Gold Service Initialized | Client");
	},
};

export default GoldClient;
