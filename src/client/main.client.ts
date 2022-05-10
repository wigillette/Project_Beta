import PersonService from "./Services/PersonService";
import TouchService from "./Services/TouchService";
import SnackbarService from "./Services/SnackbarService";
import MenuService from "./Services/MenuService";
import { Players } from "@rbxts/services";
import Roact from "@rbxts/roact";
import Main from "./Components/Main";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

const app = Roact.createElement(Main);

Roact.mount(app, playerGui, "Main");
PersonService();
TouchService();
SnackbarService();
MenuService();
