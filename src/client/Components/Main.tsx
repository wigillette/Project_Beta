import Roact from "@rbxts/roact";
import PersonList from "./Person/PersonList";
import Shop from "./Shop";

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<PersonList />
			<Shop />
		</screengui>
	);
};

export default Main;
