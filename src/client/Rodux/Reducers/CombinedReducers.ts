import Rodux from "@rbxts/rodux";
import { shopReducer } from "./ShopReducer";
import inventoryReducer from "./InventoryReducer";
import { goldReducer } from "./GoldReducer";
import { profileReducer } from "./ProfileReducer";
import { twitterReducer } from "./TwitterReducer";
import { settingsReducer } from "./SettingsReducer";
import { dailyRewardReducer } from "./DailyRewardReducer";

const reducer = Rodux.combineReducers({
	toggleShop: shopReducer,
	fetchItems: shopReducer,
	toggleInventory: inventoryReducer,
	updateInventory: inventoryReducer,
	equipItem: inventoryReducer,
	switchTab: inventoryReducer,
	setInventoryToggle: inventoryReducer,
	updateGold: goldReducer,
	fetchExp: profileReducer,
	toggleTwitter: twitterReducer,
	setTwitterToggle: twitterReducer,
	updateSettings: settingsReducer,
	toggleSettings: settingsReducer,
	setSettingsToggle: settingsReducer,
	toggleDailyReward: dailyRewardReducer,
	updateStreak: dailyRewardReducer,
});

export default reducer;
