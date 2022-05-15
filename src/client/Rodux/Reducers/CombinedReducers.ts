import Rodux from "@rbxts/rodux";
import { shopReducer } from "./ShopReducer";
import inventoryReducer from "./InventoryReducer";
import { goldReducer } from "./GoldReducer";
import { profileReducer } from "./ProfileReducer";
import { twitterReducer } from "./TwitterReducer";

const reducer = Rodux.combineReducers({
	toggleShop: shopReducer,
	fetchItems: shopReducer,
	toggleInventory: inventoryReducer,
	updateInventory: inventoryReducer,
	equipItem: inventoryReducer,
	switchTab: inventoryReducer,
	updateGold: goldReducer,
	fetchExp: profileReducer,
	toggleTwitter: twitterReducer,
	setTwitterToggle: twitterReducer,
});

export default reducer;
