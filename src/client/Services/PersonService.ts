import { KnitClient as Knit } from "@rbxts/knit";
import PersonFrame from "../Controllers/PersonList";
import Person from "shared/Person";

// Access the person service
const PersonService = Knit.GetService("PersonService");

export default function init() {
	// Handles the get people client-server communication to fetch the people objects from the server
	PersonService.GetPeoplePromise().then((peopleObjects: Person[]) => {
		peopleObjects.forEach((personObject: Person) => {
			// Create a new template for each object
			const newFrame = new PersonFrame(personObject);
		});
	});
}
