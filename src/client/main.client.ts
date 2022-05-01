import PersonService from "./Services/PersonService";
import { Players } from "@rbxts/services";
import Roact from "@rbxts/roact";
import Main from "./Components/Main";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

const app = Roact.createElement(Main);

Roact.mount(app, playerGui, "Main");
PersonService();
