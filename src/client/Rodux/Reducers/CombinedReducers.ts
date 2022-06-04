import Rodux from "@rbxts/rodux";
import { shopReducer } from "./ShopReducer";
import inventoryReducer from "./InventoryReducer";
import { goldReducer } from "./GoldReducer";
import { profileReducer } from "./ProfileReducer";
import { twitterReducer } from "./TwitterReducer";
import { settingsReducer } from "./SettingsReducer";
import { dailyRewardReducer } from "./DailyRewardReducer";
import { matchReducer } from "./MatchReducer";
import { bettingReducer } from "./BettingReducer";
import { ResultsReducer } from "./ResultsReducer";
import { votingReducer } from "./VotingReducer";
import { playerListReducer } from "./PlayerListReducer";
import { ODSReducer } from "./ODSReducer";
import { profileBoardReducer } from "./ProfileBoardReducer";
import { advertisementReducer } from "./AdvertisementReducer";
import { spectateReducer } from "./SpectateReducer";
import { ticketReducer } from "./TicketReducer";
import { craftingReducer } from "./CraftingReducer";

const reducer = Rodux.combineReducers({
	toggleShop: shopReducer,
	switchPack: shopReducer,
	toggleInventory: inventoryReducer,
	updateInventory: inventoryReducer,
	equipItem: inventoryReducer,
	switchTab: inventoryReducer,
	setInventoryToggle: inventoryReducer,
	updateGold: goldReducer,
	toggleProducts: goldReducer,
	fetchProducts: goldReducer,
	switchGoldTab: goldReducer,
	fetchExp: profileReducer,
	toggleTwitter: twitterReducer,
	setTwitterToggle: twitterReducer,
	updateSettings: settingsReducer,
	toggleSettings: settingsReducer,
	setSettingsToggle: settingsReducer,
	toggleDailyReward: dailyRewardReducer,
	updateStreak: dailyRewardReducer,
	updateMatchInfo: matchReducer,
	updateAliveCounter: matchReducer,
	updateBettingInfo: bettingReducer,
	updateBetAmount: bettingReducer,
	setBettingToggle: bettingReducer,
	toggleBetting: bettingReducer,
	selectItem: bettingReducer,
	updateResultsInfo: ResultsReducer,
	setResultsToggle: ResultsReducer,
	toggleResults: ResultsReducer,
	updateVotingOptions: votingReducer,
	setVotingToggle: votingReducer,
	setChosenMap: votingReducer,
	setChosenMode: votingReducer,
	updatePlayers: playerListReducer,
	fetchODSData: ODSReducer,
	switchODSCategory: ODSReducer,
	switchODSPage: ODSReducer,
	switchProfile: profileBoardReducer,
	updateGroupInfo: advertisementReducer,
	toggleSpectate: spectateReducer,
	switchSpectating: spectateReducer,
	updateParticipants: spectateReducer,
	getPlayers: profileBoardReducer,
	toggleMenu: profileReducer,
	getBadges: profileBoardReducer,
	viewBadges: profileBoardReducer,
	getTickets: ticketReducer,
	toggleVIPShop: shopReducer,
	selectSword: craftingReducer,
	removeSword: craftingReducer,
	toggleCrafting: craftingReducer,
	switchRarity: craftingReducer,
	emptySelectedSwords: craftingReducer,
});

export default reducer;
