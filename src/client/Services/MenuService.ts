import Roact from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import Store from "client/Rodux/Store";

// Run on client service startup
const MenuClient = {
	switchMenu: (menu: string) => {
		const twitterToggle = menu === "Twitter";
		const inventoryToggle = menu === "Inventory";
		const settingsToggle = menu === "Settings";

		Store.dispatch({
			type: "setTwitterToggle",
			payload: { toggle: twitterToggle },
		});
		Store.dispatch({
			type: "setInventoryToggle",
			toggle: inventoryToggle,
		});
		Store.dispatch({
			type: "setSettingsToggle",
			payload: { toggle: settingsToggle },
		});
	},
	toggleMenu(menu: string) {
		const action = "toggle" + menu;
		Store.dispatch({
			type: action,
		});
	},
	init: () => {
		print("Menu Service Initialized | Client");
	},
};

export default MenuClient;
