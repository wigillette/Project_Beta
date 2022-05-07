import { KnitServer as Knit } from "@rbxts/knit";
import Person from "../../shared/Person";
import PersonData from "shared/PersonData";

declare global {
	interface KnitServices {
		PersonService: typeof PersonService;
	}
}

const PersonService = Knit.CreateService({
	Name: "PersonService",
	// This will hold all the people objects created from PersonData
	PeopleObjects: [] as Person[],

	Client: {
		// Handles client-server communication; OnServerEvent
		GetPeople(player: Player) {
			return this.Server.GetPeople();
		},
	},

	// Get People Function: returns PeopleObjects from the server
	GetPeople() {
		return this.PeopleObjects;
	},

	// Initialize on service startup
	KnitInit() {
		let currentData;
		let name: string;
		let age: number;
		let gender: boolean;

		// Iterate through each person and create an object for them; initialize peopleObjects
		for (let i = 0; i < PersonData.size(); i++) {
			// Current person from the person data file
			currentData = PersonData[i];
			// Person Properties
			name = currentData[0] as string;
			age = currentData[1] as number;
			gender = currentData[2] as boolean;

			// Create the object
			this.PeopleObjects[i] = new Person(name, age, gender);
			// Display their info on the server side
			this.PeopleObjects[i].displayInfo();
		}
	},
});

export = PersonService;
