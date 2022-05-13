import Roact from "@rbxts/roact";
import PersonList from "./Person/PersonList";
import Shop from "./Shop";
import Inventory from "./Inventory";
import Gold from "./Gold";

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<PersonList />
			<Shop />
			<Inventory />
			<Gold Gold={75} />
		</screengui>
	);
};

export default Main;
