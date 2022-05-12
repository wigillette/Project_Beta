import Rodux from "@rbxts/rodux";
import { shopReducer } from "./ShopReducer";

const reducer = Rodux.combineReducers({
	toggleShop: shopReducer,
	fetchItems: shopReducer,
});

export default reducer;
