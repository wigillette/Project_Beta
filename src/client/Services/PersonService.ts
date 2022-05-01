import { KnitClient as Knit } from "@rbxts/knit";
import PersonFrame from "../View/PersonList";
import Person from "shared/Person";

const PersonService = Knit.GetService("PersonService");

export default function init() {
	PersonService.GetPeoplePromise().then((peopleObjects: Person[]) => {
		peopleObjects.forEach((personObject: Person) => {
			// Create a new template for each object
			const newFrame = new PersonFrame(personObject);
		});
	});
}
