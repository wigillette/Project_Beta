import TouchService from "./Services/TouchService";
import SnackbarService from "./Services/SnackbarService";
import InteractionService from "./Services/InteractionService";
import InventoryService from "./Services/InventoryService";
import ShopService from "./Services/ShopService";
import GoldService from "./Services/GoldService";
import ProfileService from "./Services/ProfileService";
import DailyRewardService from "./Services/DailyRewardService";
import BettingService from "./Services/BettingService";
import MatchService from "./Services/MatchService";
import VotingService from "./Services/VotingService";
import SettingsService from "./Services/SettingsService";
import { Players } from "@rbxts/services";
import Roact from "@rbxts/roact";
import Main from "./Components/Main";
import RoactRodux from "@rbxts/roact-rodux";
import store from "./Rodux/Store";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

const app = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		Main: Roact.createElement(Main),
	},
);

Roact.mount(app, playerGui, "Main");
TouchService();
SnackbarService();
InteractionService();
ShopService.init();
InventoryService.init();
GoldService.init();
ProfileService.init();
DailyRewardService.init();
BettingService.init();
MatchService.init();
VotingService.init();
SettingsService.init();
