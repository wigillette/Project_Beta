import Roact from "@rbxts/roact";
import { darkMaterial, googleMaterial, mediumGradientProperties } from "client/UIProperties/ColorSchemes";
import {
	tweenPosAbsolute,
	tweenTransparency,
	tweenRotation,
	tweenTransparencyAbsolute,
} from "client/UIProperties/FrameEffects";
import { RectContainer, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import ObjectUtils from "@rbxts/object-utils";
interface UIProps {}

interface UIState {
	word: string;
}

class MenuButtons extends Roact.Component<UIProps, UIState> {
	containerRef;
	wordRef;
	creditRef;
	state = {
		word: "SWORDLINK",
	};

	constructor(props: UIProps) {
		super(props);
		this.containerRef = Roact.createRef<Frame>();
		this.wordRef = Roact.createRef<Frame>();
		this.creditRef = Roact.createRef<TextLabel>();
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Size={new UDim2(1, 36, 1, 36)}
				Position={new UDim2(0.5, 0, 0, -36)}
				AnchorPoint={new Vector2(0.5, 0)}
				Ref={this.containerRef}
				BackgroundColor3={darkMaterial.outerBG}
				BackgroundTransparency={1}
				ZIndex={10}
			>
				<frame
					{...RectContainer}
					Size={new UDim2(0.8, 0, 0.6, 0)}
					Position={new UDim2(0.5, 0, 0.1, 0)}
					AnchorPoint={new Vector2(0.5, 0.1)}
					Ref={this.wordRef}
					ZIndex={11}
				>
					{ObjectUtils.entries(this.state.word.split("")).map((letter) => {
						return (
							<textlabel
								{...RectText}
								Size={new UDim2(0.111, 0, 1, 0)}
								TextColor3={googleMaterial.buttonColor}
								Font={Enum.Font.GothamBold}
								Position={
									new UDim2(
										0.111 * letter[0],
										math.random() * 100 - 100,
										0.5,
										math.random() * 100 - 100,
									)
								}
								AnchorPoint={new Vector2(0.111 * letter[0], 0.5)}
								Rotation={math.random() * 60}
								Text={letter[1]}
								TextTransparency={1}
								ZIndex={12}
							></textlabel>
						);
					})}
				</frame>
				<textlabel
					{...RectText}
					Ref={this.creditRef}
					TextColor3={googleMaterial.buttonColor}
					Position={new UDim2(0.111, 0, 0.8, 0)}
					AnchorPoint={new Vector2(0.111, 0.8)}
					Size={new UDim2(0.8, 0, 0.2, 0)}
					Text={"Developed by Lusconox"}
					Font={Enum.Font.GothamBold}
					TextTransparency={1}
					ZIndex={12}
				></textlabel>
				<uigradient {...mediumGradientProperties}></uigradient>
			</frame>
		);
	}

	protected didMount(): void {
		const container = this.containerRef.getValue();
		const word = this.wordRef.getValue();
		const credits = this.creditRef.getValue();
		coroutine.wrap(() => {
			if (container && word && credits) {
				tweenTransparency(container, false, true);
				let counter = 0;
				tweenTransparency(word, true, true);
				word.GetChildren().forEach((wordLabel) => {
					tweenPosAbsolute(wordLabel as Frame, new UDim2(0.111 * counter, 0, 0.5, 0));
					tweenRotation(wordLabel as Frame, 0);
					counter += 1;
				});
				tweenTransparencyAbsolute(credits, true);
				wait(1.5);
				tweenTransparency(container, true, false);
			}
		})();
	}
}

export default MenuButtons;
