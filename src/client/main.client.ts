import TouchService from "./Services/TouchService";
import SnackbarService from "./Services/SnackbarService";
import InteractionService from "./Services/InteractionService";
import InventoryService from "./Services/InventoryService";
import GoldService from "./Services/GoldService";
import ProfileService from "./Services/ProfileService";
import DailyRewardService from "./Services/DailyRewardService";
import BettingService from "./Services/BettingService";
import MatchService from "./Services/MatchService";
import VotingService from "./Services/VotingService";
import SettingsService from "./Services/SettingsService";
import ChatService from "./Services/ChatService";
import MusicService from "./Services/MusicService";
import ODSService from "./Services/ODSService";
import { Players } from "@rbxts/services";
import Roact from "@rbxts/roact";
import Main from "./Components/Main";
import KillsContainer from "./Components/Surface/KillsContainer";
import WinsContainer from "./Components/Surface/WinsContainer";
import DonationsContainer from "./Components/Surface/DonationsContainer";
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

const donationsBoard = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		DonationsContainer: Roact.createElement(DonationsContainer),
	},
);

const winsBoard = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		WinsContainer: Roact.createElement(WinsContainer),
	},
);

const killsBoard = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		KillsContainer: Roact.createElement(KillsContainer),
	},
);

Roact.mount(app, playerGui, "Main");
Roact.mount(donationsBoard, playerGui, "DonationsLB");
Roact.mount(winsBoard, playerGui, "WinsLB");
Roact.mount(killsBoard, playerGui, "KillsLB");
TouchService();
SnackbarService();
InteractionService();
InventoryService.init();
ProfileService.init();
DailyRewardService.init();
BettingService.init();
MatchService.init();
VotingService.init();
SettingsService.init();
ChatService.init();
MusicService.init();
GoldService.init();
ODSService.init();
