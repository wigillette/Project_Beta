import Roact from "@rbxts/roact";
import Shop from "./Shop";
import Inventory from "./Inventory";
import Gold from "./Gold";
import Profile from "./Profile";
import Twitter from "./Twitter";
import Settings from "./Settings";
import DailyReward from "./DailyReward";

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<Profile />
			<Shop />
			<Inventory />
			<Gold />
			<Twitter />
			<Settings />
			<DailyReward />
		</screengui>
	);
};

export default Main;
