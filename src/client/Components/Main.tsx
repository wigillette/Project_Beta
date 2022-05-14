import Roact from "@rbxts/roact";
import PersonList from "./Person/PersonList";
import Shop from "./Shop";
import Inventory from "./Inventory";
import Gold from "./Gold";
import Profile from "./Profile";
import { Players, ReplicatedStorage } from "@rbxts/services";

const client = Players.LocalPlayer;
client.CharacterAdded.Wait();
let character = client.Character;

let newCharacter: Model;
while (character && character.GetChildren().size() === 0) {
	character = client.Character;
	wait(0.05);
}
if (character) {
	character.Archivable = true;
	newCharacter = character.Clone();
	newCharacter.Parent = ReplicatedStorage;
	character.Archivable = false;
}
const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<Profile character={newCharacter} maxHealth={100} currentHealth={100} />
			<Shop />
			<Inventory />
			<Gold />
		</screengui>
	);
};

export default Main;
