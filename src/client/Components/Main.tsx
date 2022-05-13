import Roact from "@rbxts/roact";
import PersonList from "./Person/PersonList";
import Shop from "./Shop";
import Inventory from "./Inventory";

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<PersonList />
			<Shop />
			<Inventory />
		</screengui>
	);
};

export default Main;
