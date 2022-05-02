import { Players } from "@rbxts/services";
import Person from "shared/Person";
import PersonTemplate from "../Components/PersonTemplate";
import Roact from "@rbxts/roact";

// PersonTemplate Properties
interface UIProps {
	Name: string;
	Age: number;
	Gender: string;
}

// Person Frame Class
class PersonFrame {
	constructor(person: Person) {
		// Load UI Objects
		const client = Players.LocalPlayer;
		const pg = client.WaitForChild("PlayerGui");
		const main = pg.WaitForChild("Main");
		const personList = main.WaitForChild("PersonList");

		// Template Objects
		const props: UIProps = {
			Age: person.age,
			Name: person.name,
			Gender: (person.gender && "Male") || "Female",
		};

		// Create the template element
		const newTemplate = Roact.createElement(PersonTemplate, props);

		// Mount it to the main UI
		Roact.mount(newTemplate, personList);
	}
}

export default PersonFrame;
