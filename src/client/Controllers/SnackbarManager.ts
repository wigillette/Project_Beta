import { Players } from "@rbxts/services";
import Roact from "@rbxts/roact";
import SnackbarContainer from "client/Components/Snackbar/SnackbarContainer";
import SnackbarItem from "client/Components/Snackbar/SnackbarItem";

// SnackbarManager Class
class SnackbarManager {
	currentTree: Roact.Tree | undefined;
	snackbarContainer: Frame;
	isActive: boolean;

	public pushNotification(alert: string) {
		spawn(() => {
			while (this.isActive) {
				wait(2);
			}
			this.isActive = true;
			const newItem = Roact.createElement(SnackbarItem, { Alert: alert });
			if (this.currentTree) {
				// Unmount the previous tree
				Roact.unmount(this.currentTree as Roact.Tree);
			}
			// Mount the new tree
			this.currentTree = Roact.mount(newItem, this.snackbarContainer);
			wait(3);
			this.isActive = false;
		});
	}

	constructor() {
		// Fetching the player objects
		const client = Players.LocalPlayer;
		const pg = client.WaitForChild("PlayerGui");
		const main = pg.WaitForChild("Main");

		// Creating the snack bar container
		const containerElement = Roact.createElement(SnackbarContainer);

		// Mounting the snack bar container to the view
		Roact.mount(containerElement, main);

		// Setting up object variables
		this.snackbarContainer = main.WaitForChild("Snackbar") as Frame;
		this.currentTree = undefined;
		this.isActive = false;
	}
}

export default SnackbarManager;
