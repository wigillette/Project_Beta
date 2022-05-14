import SnackbarManager from "client/Controllers/SnackbarManager";
import { KnitClient as Knit } from "@rbxts/knit";

// Fetch the service from Knit
const snackbarService = Knit.GetService("SnackbarService");
// Create the manager object
let snackbarManagerObject: SnackbarManager | undefined = undefined;

// Run on client service startup
export default function init() {
	print("Snackbar Service Initialized | Client");
	snackbarManagerObject = new SnackbarManager();
	// Handle the client-server notification; retrieve alert from server and create notification on client
	snackbarService.PushNotification.Connect((alert: string) => {
		if (snackbarManagerObject) {
			snackbarManagerObject.pushNotification(alert);
		}
	});
}

export const pushNotification = (alert: string) => {
	if (snackbarManagerObject) {
		snackbarManagerObject.pushNotification(alert);
	}
};
