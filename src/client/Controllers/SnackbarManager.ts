import { Players } from "@rbxts/services";
import Roact from "@rbxts/roact";
import SnackbarContainer from "client/Components/Snackbar/SnackbarContainer";
import SnackbarItem from "client/Components/Snackbar/SnackbarItem";
import { tweenPos, tweenPosAbsolute } from "client/UIProperties/FrameEffects";

// SnackbarManager Class
class SnackbarObject {
	tree: Roact.Tree;
	index: number;
	container: Frame;

	incrementIndex() {
		this.index += 1;
		if (this.container) {
			this.container.Name = tostring(this.index);
		}
	}

	getIndex() {
		return this.index;
	}

	constructor(tree: Roact.Tree, container: Frame) {
		this.tree = tree;
		this.index = 0;
		this.container = container;
	}
}

const positions: number[] = [1, 0.75, 0.5];
class SnackbarManager {
	objects: SnackbarObject[];
	snackbarContainer: Frame;

	public popNotification(snackbarObj: SnackbarObject) {
		const index = this.objects.indexOf(snackbarObj);
		if (index !== -1) {
			this.objects.remove(index);
		}
		Roact.unmount(snackbarObj.tree);
	}

	public pushNotification(alert: string) {
		this.objects.forEach((object) => {
			object.incrementIndex();
			if (object.getIndex() > 2) {
				this.popNotification(object);
			} else if (object.container && object.index in positions) {
				tweenPosAbsolute(
					object.container,
					new UDim2(0.5, 0, positions[object.getIndex() as keyof typeof positions] as number, 0),
				);
			}
		});

		// Mount the new tree
		const newItem = Roact.createElement(SnackbarItem, { Alert: alert, Index: 0 });

		const tree = Roact.mount(newItem, this.snackbarContainer);
		const container = this.snackbarContainer.WaitForChild(0, 10) as Frame;
		const object = new SnackbarObject(tree, container);
		this.objects.push(object);

		spawn(() => {
			wait(2);
			this.popNotification(object);
		});
		print(this.objects);
	}

	constructor() {
		const client = Players.LocalPlayer;
		const pg = client.WaitForChild("PlayerGui");
		const main = pg.WaitForChild("Main");
		// Creating the snack bar container
		const containerElement = Roact.createElement(SnackbarContainer);

		// Mounting the snack bar container to the view
		Roact.mount(containerElement, main);

		// Setting up object variables
		this.snackbarContainer = main.WaitForChild("Snackbar") as Frame;
		this.objects = [];
	}
}

export default SnackbarManager;
