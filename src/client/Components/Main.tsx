import Roact from "@rbxts/roact";
import PersonList from "./Person/PersonList";
import Shop from "./Shop";
import Inventory from "./Inventory";
import Gold from "./Gold";
import Profile from "./Profile";

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<Profile maxHealth={100} currentHealth={100} />
			<Shop />
			<Inventory />
			<Gold />
		</screengui>
	);
};

export default Main;
