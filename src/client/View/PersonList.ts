import { Players, ReplicatedStorage } from "@rbxts/services";
import Person from "shared/Person";

// UI Objects
const client = Players.LocalPlayer;
const playerGUI = client.WaitForChild("PlayerGui");
const main = playerGUI.WaitForChild("Main");
const personList = main.WaitForChild("PersonList");
const personTemplate = ReplicatedStorage.WaitForChild("PersonTemplate");

// Person Frame Class
class PersonFrame {
	constructor(person: Person) {
		// Template Objects
		const newPersonFrame = personTemplate.Clone();
		const dataLabel = newPersonFrame.WaitForChild("DataLabel") as TextLabel;

		// Initializing Template Properties
		const name = person.name;
		const age = tostring(person.age);
		const gender = (person.gender && "Male") || "Female";
		dataLabel.Text = string.format("%s | %s | %s", name, age, gender);

		// Insert Into List
		newPersonFrame.Parent = personList;
	}
}

export default PersonFrame;
