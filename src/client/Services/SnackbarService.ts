import SnackbarManager from "client/Controllers/SnackbarManager";
import { KnitClient as Knit } from "@rbxts/knit";

// Fetch the service from Knit
const snackbarService = Knit.GetService("SnackbarService");

// Run on client service startup
export default function init() {
	// Create the manager object
	const snackbarManagerObject = new SnackbarManager();

	// Handle the client-server notification; retrieve alert from server and create notification on client
	snackbarService.PushNotification.Connect((alert: string) => {
		snackbarManagerObject.pushNotification(alert);
	});
}
