import Roact from "@rbxts/roact";
import {
	darkMaterial,
	googleMaterial,
	gradientProperties,
	mediumGradientProperties,
	whiteGradientProperties,
} from "client/UIProperties/ColorSchemes";
import { CircBG, CircContainer } from "client/UIProperties/CircularUI";
import { movingFade, movingFadeAbsolute } from "client/UIProperties/FrameEffects";
interface UIProps {}

class IntroItem extends Roact.Component<UIProps> {
	upperRef;
	lowerRef;

	constructor(props: UIProps) {
		super(props);
		this.upperRef = Roact.createRef<ImageLabel>();
		this.lowerRef = Roact.createRef<ImageLabel>();
	}

	render() {
		return (
			<frame
				{...CircContainer}
				Size={new UDim2(0.1, 0, 1, 36)}
				Position={new UDim2(0, 0, 0, -36)}
				AnchorPoint={new Vector2(0, 0)}
				BackgroundColor3={darkMaterial.outerBG}
				BackgroundTransparency={1}
				ZIndex={12}
			>
				<imagelabel
					{...CircBG}
					Ref={this.upperRef}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Size={new UDim2(1, 0, 0.75, 0)}
					ImageColor3={googleMaterial.buttonColor}
					Key={"Upper"}
					ZIndex={13}
				>
					<uigradient {...mediumGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel
					{...CircBG}
					Ref={this.lowerRef}
					Position={new UDim2(0.5, 0, 0.3, 0)}
					AnchorPoint={new Vector2(0.5, 0.3)}
					Size={new UDim2(1, 0, 1, 0)}
					ImageColor3={Color3.fromRGB(122, 214, 240)}
					Key={"Bottom"}
					ZIndex={12}
				>
					<uigradient {...gradientProperties}></uigradient>
				</imagelabel>
			</frame>
		);
	}

	protected didMount(): void {
		const upperFrame = this.upperRef.getValue();
		const lowerFrame = this.lowerRef.getValue();
		let randY;

		spawn(() => {
			for (let i = 0; i < 25; i++) {
				if (upperFrame && lowerFrame) {
					pcall(() => {
						randY = math.random() * 0.2 + 0.1;
						upperFrame.TweenPosition(
							new UDim2(
								upperFrame.Position.X.Scale,
								upperFrame.Position.X.Offset,
								randY,
								upperFrame.Position.Y.Offset,
							),
							Enum.EasingDirection.Out,
							Enum.EasingStyle.Quad,
							0.25,
							true,
							undefined,
						);
						lowerFrame.TweenPosition(
							new UDim2(
								lowerFrame.Position.X.Scale,
								lowerFrame.Position.X.Offset,
								0.7 - randY,
								lowerFrame.Position.Y.Offset,
							),
							Enum.EasingDirection.Out,
							Enum.EasingStyle.Quad,
							0.25,
							true,
							undefined,
						);
					});
					wait(0.25);
				}
			}
			if (upperFrame && lowerFrame) {
				movingFade(upperFrame, false, 0.3, false);
				movingFade(lowerFrame, false, -0.3, false);
			}
		});
	}
}

export default IntroItem;
