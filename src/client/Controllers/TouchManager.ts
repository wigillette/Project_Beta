import { Players } from "@rbxts/services";
import { tweenTransparency } from "client/UIProperties/FrameEffects";

// Touch Manager Class
class TouchManager {
	ui: Frame;
	trigger: BasePart;

	public displayUI() {
		// Display the UI when the player is in range
		if (this.ui && !this.ui.Visible) {
			this.ui.Visible = true;
			tweenTransparency(this.ui, true, true);
		}
	}

	public hideUI() {
		// Hide the UI when the player is no longer in range
		if (this.ui && this.ui.Visible) {
			coroutine.wrap(() => {
				tweenTransparency(this.ui, true, false);
				wait(0.4);
				this.ui.Visible = false;
			})();
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

	constructor(trigger: BasePart, ui: Frame) {
		// Linking a part to a UI; display the UI on close proximity to the part
		this.ui = ui;
		this.trigger = trigger;
		this.ui.Visible = true;
	}
}

export default TouchManager;
