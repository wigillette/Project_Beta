import { MarketplaceService, Players } from "@rbxts/services";
import { tweenTransparency } from "client/UIProperties/FrameEffects";
import Store from "client/Rodux/Store";
import { KnitClient } from "@rbxts/knit";
const shopService = KnitClient.GetService("ShopService");

// Touch Manager Class
class TouchManager {
	action: string | (() => void);
	trigger: BasePart;
	open: boolean;
	enterCallback: (() => void) | undefined;
	leaveCallback: (() => void) | undefined;

	public displayUI() {
		// Display the UI when the player is in range
		if (!this.open) {
			this.open = true;
			if (typeIs(this.action, "string")) {
				const canView =
					this.action !== "toggleVIPShop" ||
					MarketplaceService.UserOwnsGamePassAsync(Players.LocalPlayer.UserId, 48719460);
				if (canView) {
					Store.dispatch({
						type: this.action as string,
					});

					if (this.enterCallback) {
						this.enterCallback();
					}
				}
			} else {
				(this.action as () => void)();
			}
		}
	}

	public hideUI() {
		// Hide the UI when the player is no longer in range
		if (this.open) {
			this.open = false;
			if (typeIs(this.action, "string")) {
				const canView =
					this.action !== "toggleVIPShop" ||
					MarketplaceService.UserOwnsGamePassAsync(Players.LocalPlayer.UserId, 48719460);
				if (canView) {
					Store.dispatch({
						type: this.action as string,
					});

					if (this.leaveCallback) {
						this.leaveCallback();
					}
				}
			}
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
	) {
		// Linking a part to a UI; display the UI on close proximity to the part
		this.trigger = trigger;
		this.action = action;
		this.open = false;
		this.enterCallback = enterCallback || undefined;
		this.leaveCallback = leaveCallback || undefined;
	}
}

export default TouchManager;
