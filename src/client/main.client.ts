import TouchService from "./Services/TouchService";
import SnackbarService from "./Services/SnackbarService";
import MenuService from "./Services/MenuService";
import InteractionService from "./Services/InteractionService";
import InventoryService from "./Services/InventoryService";
import ShopService from "./Services/ShopService";
import GoldService from "./Services/GoldService";
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
MenuService();
InteractionService();
ShopService.init();
InventoryService.init();
GoldService.init();
