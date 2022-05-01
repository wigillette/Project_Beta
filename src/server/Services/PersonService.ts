import { KnitServer as Knit } from "@rbxts/knit";
import Person from "../../shared/Person";
import PersonData from "shared/UserData";

declare global {
	interface KnitServices {
		PersonService: typeof PersonService;
	}
}

const PersonService = Knit.CreateService({
	Name: "PersonService",
	PeopleObjects: [] as Person[],

	Client: {
		GetPeople(player: Player) {
			return this.Server.GetPeople();
		},
	},

	// Get People:
	GetPeople() {
		return this.PeopleObjects;
	},

	// Initialize
	KnitInit() {
		let currentData;
		let name: string;
		let age: number;
		let gender: boolean;

		for (let i = 0; i < PersonData.size(); i++) {
			currentData = PersonData[i];
			name = currentData[0] as string;
			age = currentData[1] as number;
			gender = currentData[2] as boolean;

			this.PeopleObjects[i] = new Person(name, age, gender);
			this.PeopleObjects[i].displayInfo();
		}
	},
});

export = PersonService;
