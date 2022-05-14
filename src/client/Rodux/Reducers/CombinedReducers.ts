import Rodux from "@rbxts/rodux";
import { shopReducer } from "./ShopReducer";
import inventoryReducer from "./InventoryReducer";
import { goldReducer } from "./GoldReducer";

const reducer = Rodux.combineReducers({
	toggleShop: shopReducer,
	fetchItems: shopReducer,
	toggleInventory: inventoryReducer,
	updateInventory: inventoryReducer,
	equipItem: inventoryReducer,
	switchTab: inventoryReducer,
	updateGold: goldReducer,
});

export default reducer;
