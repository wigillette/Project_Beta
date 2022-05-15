import Roact from "@rbxts/roact";
import Shop from "./Shop";
import Inventory from "./Inventory";
import Gold from "./Gold";
import Profile from "./Profile";
import Twitter from "./Twitter";

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<Profile />
			<Shop />
			<Inventory />
			<Gold />
			<Twitter />
		</screengui>
	);
};

export default Main;
