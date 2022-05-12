import { KnitClient as Knit } from "@rbxts/knit";
import Store from "../Rodux/Store";
const ShopService = Knit.GetService("ShopService");

const ShopClient = {
	FetchItems: (items: Map<string, number>) => {
		print("Dispatching shop items to Store.. | Client");
		Store.dispatch({
			type: "fetchItems",
			payload: { items: items },
		});
	},
	init: () => {
		ShopService.GetShopDataPromise().then((shopData) => {
			ShopClient.FetchItems(shopData);
		});
		print("Shop Service Initialized | Client");
	},
};

export default ShopClient;
