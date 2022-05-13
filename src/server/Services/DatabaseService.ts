import { KnitServer as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import { InventoryService } from "../Services/InventoryService";
import { InventoryFormat, INITIAL_INVENTORY } from "../../shared/InventoryInfo";

declare global {
	interface KnitServices {
		DatabaseService: typeof DatabaseService;
	}
}

const DatabaseService = Knit.CreateService({
	Name: "DatabaseService",

	LoadData(Player: Player) {
		print(`Attempting to load ${Player.Name}'s data`);
		const InventoryStore = Database("Inventory", Player);
		const Inventory = InventoryStore.GetAsync(INITIAL_INVENTORY).then((inventory) => {
			print(inventory);
			InventoryService.InitData(Player, inventory as InventoryFormat);
		});
	},

	SaveData(Player: Player) {
		print(`Attempting to save ${Player.Name}'s data`);
		Database.SaveAllAsync(Player)
			.then(() => {
				print(`Successfully saved ${Player.Name}'s Data!`);
			})
			.catch((err) => {
				print(`Failed to save ${Player.Name}'s Data`);
				print(err);
			});
	},

	KnitInit() {
		Database.Combine("UserData", "Inventory");
		Players.PlayerAdded.Connect((player) => {
			this.LoadData(player);
		});
		print("Database Service Initialized | Server");
	},
});

export default DatabaseService;
