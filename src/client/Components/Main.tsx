import Roact from "@rbxts/roact";
import PersonList from "./PersonList";

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<PersonList />
		</screengui>
	);
};

export default Main;
