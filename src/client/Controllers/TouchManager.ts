import { MarketplaceService, Players } from "@rbxts/services";
import { tweenTransparency } from "client/UIProperties/FrameEffects";
import Store from "client/Rodux/Store";
import { KnitClient } from "@rbxts/knit";
import { pushNotification } from "client/Services/SnackbarService";
const shopService = KnitClient.GetService("ShopService");

// Touch Manager Class
class TouchManager {
	action: string | (() => void);
	trigger: BasePart;
	open: boolean;
	enterCallback: (() => void) | undefined;
	leaveCallback: (() => void) | undefined;
	conditionFunction: (() => [boolean, string]) | undefined;
	debounce: boolean;

	public displayUI() {
		// Display the UI when the player is in range
		if (!this.open && !this.debounce) {
			this.open = true;
			this.debounce = true;

			if (typeIs(this.action, "string")) {
				let canView = true;
				if (this.conditionFunction !== undefined) {
					canView = this.conditionFunction()[0];
				}

				if (canView) {
					Store.dispatch({
						type: this.action as string,
					});
					Store.dispatch({
						type: "hideMenu",
					});

					if (this.enterCallback) {
						this.enterCallback();
					}
				} else {
					if (this.conditionFunction !== undefined) {
						pushNotification(this.conditionFunction()[1]);
					}
				}
			} else {
				(this.action as () => void)();
				Store.dispatch({
					type: "hideMenu",
				});
			}
			wait(0.2);
			this.debounce = false;
		}
	}

	public hideUI() {
		// Hide the UI when the player is no longer in range
		if (this.open && !this.debounce) {
			this.open = false;
			this.debounce = true;
			if (typeIs(this.action, "string")) {
				let canView = true;
				if (this.conditionFunction !== undefined) {
					canView = this.conditionFunction()[0];
				}
				if (canView) {
					Store.dispatch({
						type: this.action as string,
					});
					Store.dispatch({
						type: "showMenu",
					});

					if (this.leaveCallback) {
						this.leaveCallback();
					}
				}
			}
			wait(0.2);
			this.debounce = false;
		}
	}

	public isWithinRange() {
		// Checking if the player is within range of the part
		return this.calculateDistance() <= this.getDiagonalSize() / 2;
	}

	private getDiagonalSize() {
		// Calculating the length of the trigger's diagonal using the pythagorean thorem
		let distance = 0;
		if (this.trigger) {
			distance = math.sqrt(math.pow(this.trigger.Size.X, 2) + math.pow(this.trigger.Size.Z, 2));
		}

		return distance;
	}

	private calculateDistance() {
		// Calculating the magnitude between the player's position and the trigger's position
		const client = Players.LocalPlayer;
		const character = client.Character;
		let distance = 0;
		if (character) {
			const hrp = character.PrimaryPart;
			if (hrp) {
				distance = hrp.Position.sub(this.trigger.Position).Magnitude;
			}
		}
		return distance;
	}

	constructor(
		trigger: BasePart,
		action: string | (() => void),
		enterCallback?: () => void,
		leaveCallback?: () => void,
		conditionFunction?: () => [boolean, string],
	) {
		// Linking a part to a UI; display the UI on close proximity to the part
		this.trigger = trigger;
		this.action = action;
		this.open = false;
		this.enterCallback = enterCallback || undefined;
		this.leaveCallback = leaveCallback || undefined;
		this.conditionFunction = conditionFunction || undefined;
		this.debounce = false;
	}
}

export default TouchManager;
