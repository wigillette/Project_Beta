import { Players, UserInputService } from "@rbxts/services";
import Interaction from "client/Components/Interaction";
import Roact, { Tree } from "@rbxts/roact";
import { tweenTransparency } from "client/UIProperties/FrameEffects";

// Touch Manager Class
class InteractionManager {
	static tree: Tree | undefined = undefined;
	name: string;
	body: string;
	model: Model;
	animation: string | undefined;
	connections: RBXScriptConnection[] = [];
	holding = false;
	counter = 0;
	holdingSeconds = 0;

	public initInputConnection() {
		if (this.connections.size() < 1) {
			// Display the interaction UI after the user holds down the E key for long enough
			const inputConnection = UserInputService.InputBegan.Connect((input) => {
				if (input.UserInputType === Enum.UserInputType.Keyboard) {
					const keyPressed = input.KeyCode;
					if (keyPressed === Enum.KeyCode.E && InteractionManager.tree === undefined) {
						const client = Players.LocalPlayer;
						const pg = client.WaitForChild("PlayerGui", 10);
						const main = pg?.WaitForChild("Main");
						const head = this.model.WaitForChild("Head", 10);
						if (head) {
							const billboard = head.FindFirstChildOfClass("BillboardGui");

							if (billboard) {
								const spriteSheet = billboard.FindFirstChild("SpriteSheet", true) as ImageLabel;
								if (!this.holding && spriteSheet) {
									this.holding = true;

									// Animate the sprite sheet while the user is holding the key down
									for (let i = this.counter; i < 64 && this.holding; i++) {
										spriteSheet.ImageRectOffset = new Vector2(
											math.clamp((i % 8) * 128, 0, 896),
											math.clamp(math.floor(i / 8) * 128, 0, 896),
										);
										wait(1 / 32);
										this.holdingSeconds = math.clamp(this.holdingSeconds + 1 / 32, 0, 2);
										this.counter = i;
									}
								}

								if (this.holdingSeconds >= 2 && main) {
									// Display the interaction UI after two seconds of holding
									const newInteraction = Roact.createElement(Interaction, {
										Header: this.name,
										Body: this.body,
										Model: this.model,
										Animation: this.animation,
										InteractionObject: this,
									});

									InteractionManager.tree = Roact.mount(newInteraction, main);
								}
							}
						}
					}
				}
			});

			// Stop animating the sprite sheet when the user releases the key
			const endConnection = UserInputService.InputEnded.Connect((input) => {
				if (input.UserInputType === Enum.UserInputType.Keyboard) {
					const keyPressed = input.KeyCode;
					if (keyPressed === Enum.KeyCode.E && InteractionManager.tree === undefined) {
						this.holding = false;
					}
				}
			});
			this.connections.push(inputConnection);
			this.connections.push(endConnection);
		}
	}

	public resetSpriteSheet() {
		const head = this.model.WaitForChild("Head", 10);
		this.holdingSeconds = 0;
		this.counter = 0;
		if (head) {
			const billboard = head.FindFirstChildOfClass("BillboardGui");

			if (billboard) {
				const spriteSheet = billboard.FindFirstChild("SpriteSheet", true) as ImageLabel;
				if (spriteSheet) {
					spriteSheet.ImageRectOffset = new Vector2(-100, 0);
				}
			}
		}
	}

	public endInputConnection() {
		if (this.connections.size() > 0) {
			this.connections.forEach((connection) => {
				connection.Disconnect();
			});
			// Unmount the current tree when the user walks away
			coroutine.wrap(() => {
				if (InteractionManager.tree) {
					Roact.unmount(InteractionManager.tree);
					InteractionManager.tree = undefined;
					this.resetSpriteSheet();
				}
			})();
			this.connections = [];
		}
	}

	public isWithinRange() {
		// Checking if the player is within range of the part
		return this.calculateDistance() <= 20;
	}

	private calculateDistance() {
		// Calculating the magnitude between the player's position and the trigger's position
		const client = Players.LocalPlayer;
		const character = client.Character;
		let distance = 0;
		if (character) {
			const hrp = character.PrimaryPart;
			if (hrp && this.model.PrimaryPart) {
				distance = hrp.Position.sub(this.model.PrimaryPart.Position).Magnitude;
			}
		}
		return distance;
	}

	constructor(name: string, body: string, model: Model, animation: string | undefined) {
		// Allow the user to interact with a NPC upon moving near it
		this.body = body;
		this.name = name;
		this.model = model;
		this.animation = animation;
	}
}

export default InteractionManager;
