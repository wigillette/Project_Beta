import { Players } from "@rbxts/services";
import { tweenTransparency } from "client/UIProperties/FrameEffects";

// Touch Manager Class
class TouchManager {
	ui: Frame;
	part: BasePart;

	public displayUI() {
		if (this.ui && !this.ui.Visible) {
			this.ui.Visible = true;
			tweenTransparency(this.ui, true, true);
		}
	}

	public hideUI() {
		if (this.ui && this.ui.Visible) {
			coroutine.wrap(() => {
				tweenTransparency(this.ui, true, false);
				wait(0.4);
				this.ui.Visible = false;
			})();
		}
	}

	public isWithinRange() {
		return this.calculateDistance() <= this.getDiagonalSize() / 2;
	}

	private getDiagonalSize() {
		let distance = 0;
		if (this.part) {
			distance = math.sqrt(math.pow(this.part.Size.X, 2) + math.pow(this.part.Size.Z, 2));
		}

		return distance;
	}

	private calculateDistance() {
		const client = Players.LocalPlayer;
		const character = client.Character;
		let distance = 0;
		if (character) {
			const hrp = character.PrimaryPart;
			if (hrp) {
				distance = hrp.Position.sub(this.part.Position).Magnitude;
			}
		}
		return distance;
	}

	constructor(part: BasePart, ui: Frame) {
		// Linking a part to a UI
		this.ui = ui;
		this.part = part;
		this.ui.Visible = true;
	}
}

export default TouchManager;
