import Person from "./Person";
import PersonData from "shared/UserData";

const personObjects = [];
let currentData;
let name: string;
let age: number;
let gender: boolean;

for (let i = 0; i < PersonData.size(); i++) {
	currentData = PersonData[i];
	name = currentData[0] as string;
	age = currentData[1] as number;
	gender = currentData[2] as boolean;

	personObjects[i] = new Person(name, age, gender);
	personObjects[i].displayInfo();
}
