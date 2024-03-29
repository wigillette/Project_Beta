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
import TicketService from "./Services/ArenaTicketService";
import AdvertisementService from "./Services/AdvertisementService";
import { Players } from "@rbxts/services";
import Roact from "@rbxts/roact";
import Main from "./Components/Main";
import KillsContainer from "./Components/Surface/KillsLB/KillsContainer";
import DonationsShop from "./Components/Surface/DonationsShop/ShopContainer";
import WinsContainer from "./Components/Surface/WinsLB/WinsContainer";
import DonationsContainer from "./Components/Surface/DonationsLB/DonationsContainer";
import MapsContainer from "./Components/Surface/MapsList/MapsContainer";
import ModesContainer from "./Components/Surface/ModesList/ModesContainer";
import RoactRodux from "@rbxts/roact-rodux";
import store from "./Rodux/Store";
import ProfileBoardContainer from "./Components/Surface/ProfileBoard/ProfileBoardContainer";
import AdvertisementContainer from "./Components/Surface/GroupAdvertisement/AdvertisementContainer";
import GamepassContainer from "./Components/Surface/Gamepasses/ShopContainer";
import ObbyChestService from "./Services/ObbyChestService";
import SpectateService from "./Services/SpectateService";
import LobbyAnimationsClient from "./Services/LobbyAnimations";
import TradingClient from "./Services/TradingService";
import CraftingClient from "./Services/CraftingService";
import IdleClient from "./Services/IdleService";
import OldIntro from "./Components/Introduction/OldIntro";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

const intro = Roact.createElement(OldIntro);

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

const donationsShop = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		DonationsShop: Roact.createElement(DonationsShop),
	},
);

const mapsList = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		MapsList: Roact.createElement(MapsContainer),
	},
);

const modesList = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		ModesList: Roact.createElement(ModesContainer),
	},
);

const profileBoard = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		ProfileBoard: Roact.createElement(ProfileBoardContainer),
	},
);

const gamepassBoard = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		ProfileBoard: Roact.createElement(GamepassContainer),
	},
);

const advertisementBoard1 = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		AdvertisementBoard: Roact.createElement(AdvertisementContainer, { boardKey: 1 }),
	},
);

const advertisementBoard2 = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		AdvertisementBoard: Roact.createElement(AdvertisementContainer, { boardKey: 2 }),
	},
);

const advertisementBoard3 = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		AdvertisementBoard: Roact.createElement(AdvertisementContainer, { boardKey: 3 }),
	},
);

const advertisementBoard4 = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		AdvertisementBoard: Roact.createElement(AdvertisementContainer, { boardKey: 4 }),
	},
);

const advertisementBoard5 = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		AdvertisementBoard: Roact.createElement(AdvertisementContainer, { boardKey: 5 }),
	},
);

const advertisementBoard6 = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: store,
	},
	{
		AdvertisementBoard: Roact.createElement(AdvertisementContainer, { boardKey: 6 }),
	},
);

Roact.mount(app, playerGui, "Main");
Roact.mount(donationsBoard, playerGui, "DonationsLB");
Roact.mount(winsBoard, playerGui, "WinsLB");
Roact.mount(killsBoard, playerGui, "KillsLB");
Roact.mount(donationsShop, playerGui, "DonationsShop");
Roact.mount(mapsList, playerGui, "MapsList");
Roact.mount(modesList, playerGui, "ModesList");
Roact.mount(profileBoard, playerGui, "ProfileBoard");
Roact.mount(gamepassBoard, playerGui, "GamepassBoard");
Roact.mount(advertisementBoard1, playerGui, "AdvertisementBoard1");
Roact.mount(advertisementBoard2, playerGui, "AdvertisementBoard2");
Roact.mount(advertisementBoard3, playerGui, "AdvertisementBoard3");
Roact.mount(advertisementBoard4, playerGui, "AdvertisementBoard4");
Roact.mount(advertisementBoard5, playerGui, "AdvertisementBoard5");
Roact.mount(advertisementBoard6, playerGui, "AdvertisementBoard6");

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
AdvertisementService.init();
ObbyChestService.init();
SpectateService.init();
LobbyAnimationsClient.init();
TicketService.init();
TradingClient.init();
CraftingClient.init();
IdleClient.init();

// spawn(() => {
// 	wait(0.5);
Roact.mount(intro, playerGui, "Intro");
// });
