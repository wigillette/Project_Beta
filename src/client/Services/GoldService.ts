import { KnitClient as Knit } from "@rbxts/knit";
import { productFormat } from "client/Rodux/Reducers/GoldReducer";
import Store from "../Rodux/Store";
const GoldService = Knit.GetService("GoldService");
const GoldClient = {
	GoldChanged: (Gold: number) => {
		Store.dispatch({
			type: "updateGold",
			payload: { Gold: Gold },
		});
	},
	FetchProducts: (products: productFormat[]) => {
		Store.dispatch({
			type: "fetchProducts",
			payload: { products: products },
		});
	},
	init: () => {
		const initialGold = GoldService.GetGold();
		GoldClient.GoldChanged(initialGold);
		GoldService.GoldChanged.Connect(GoldClient.GoldChanged);
		GoldService.GetProductsPromise()
			.then((products) => {
				const page = (products && (products.GetCurrentPage() as productFormat[])) || ([] as productFormat[]);
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
