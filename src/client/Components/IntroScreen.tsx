import Roact from "@rbxts/roact";
import {
	darkMaterial,
	googleMaterial,
	mediumGradientProperties,
	gradientProperties,
} from "client/UIProperties/ColorSchemes";
import {
	tweenPosAbsolute,
	tweenTransparency,
	tweenRotation,
	tweenTransparencyAbsolute,
} from "client/UIProperties/FrameEffects";
import { RectContainer, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import ObjectUtils from "@rbxts/object-utils";
import RectProgress from "./Material/RectProgress";
import { CircBG, CircContainer } from "client/UIProperties/CircularUI";
interface UIProps {}

interface UIState {
	word: number;
}

class MenuButtons extends Roact.Component<UIProps, UIState> {
	containerRef;
	wordRef;
	creditRef;
	progressBarRef;

	constructor(props: UIProps) {
		super(props);
		this.containerRef = Roact.createRef<Frame>();
		this.wordRef = Roact.createRef<ImageLabel>();
		this.creditRef = Roact.createRef<TextLabel>();
		this.progressBarRef = Roact.createRef<ImageLabel>();
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
				ZIndex={12}
			>
				<frame
					{...RectContainer}
					Size={new UDim2(0.9, 0, 0.35, 0)}
					Position={new UDim2(0.5, 0, 0.1, 0)}
					AnchorPoint={new Vector2(0.5, 0.1)}
					ZIndex={13}
				>
					<uiaspectratioconstraint
						AspectRatio={7}
						AspectType={"ScaleWithParentSize"}
						DominantAxis="Width"
					></uiaspectratioconstraint>
					<imagelabel
						{...RectContainer}
						Size={new UDim2(0.95, 0, 1, 0)}
						Image={"rbxassetid://9718833947"}
						ImageTransparency={1}
						Position={new UDim2(0.5, 0, 0.5, -500)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Ref={this.wordRef}
						ZIndex={15}
					></imagelabel>
				</frame>
				<textlabel
					{...RectText}
					Ref={this.creditRef}
					TextColor3={googleMaterial.buttonColor}
					Position={new UDim2(0.111, 0, 0.6, 0)}
					AnchorPoint={new Vector2(0.111, 0.6)}
					Size={new UDim2(0.8, 0, 0.2, 0)}
					Text={"Developed by Lusconox"}
					Font={Enum.Font.GothamBold}
					TextTransparency={1}
					ZIndex={14}
				></textlabel>
				<frame
					{...CircContainer}
					Size={new UDim2(0.8, 0, 0.05, 0)}
					Position={new UDim2(0.5, 0, 0.8, 0)}
					AnchorPoint={new Vector2(0.5, 0.8)}
					ZIndex={14}
				>
					<uiaspectratioconstraint
						AspectRatio={12}
						DominantAxis={"Width"}
						AspectType={"ScaleWithParentSize"}
					></uiaspectratioconstraint>
					<imagelabel {...CircBG} ImageColor3={googleMaterial.cardBG} ZIndex={15}>
						<uigradient {...gradientProperties}></uigradient>
						<imagelabel
							{...CircBG}
							Size={new UDim2(0, 0, 0.75, 0)}
							Position={new UDim2(0.015, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0, 0.5)}
							ImageColor3={googleMaterial.buttonColor}
							ZIndex={16}
							Ref={this.progressBarRef}
						>
							<uigradient {...mediumGradientProperties}></uigradient>
						</imagelabel>
					</imagelabel>
				</frame>
				<uigradient {...mediumGradientProperties}></uigradient>
			</frame>
		);
	}

	protected didMount(): void {
		const container = this.containerRef.getValue();
		const word = this.wordRef.getValue();
		const credits = this.creditRef.getValue();
		const progressBar = this.progressBarRef.getValue();
		spawn(() => {
			if (container && word && word.Parent && credits && progressBar) {
				tweenTransparency(container, false, true);
				tweenTransparency(word.Parent as Frame, true, true);
				wait(1);
				pcall(() => {
					word.TweenPosition(
						new UDim2(word.Position.X.Scale, 0, word.Position.Y.Scale, 0),
						Enum.EasingDirection.Out,
						Enum.EasingStyle.Bounce,
						0.5,
						true,
						undefined,
					);
				});

				tweenTransparencyAbsolute(credits, true);

				let percentage = 0;
				while (percentage + 0.01 < 0.97) {
					let randomStep = math.random() * 0.15;
					while (percentage + randomStep > 0.97) {
						randomStep = math.random() * 0.15;
					}
					percentage += randomStep;
					pcall(() => {
						progressBar.TweenSize(
							new UDim2(percentage, 0, 0.8, 0),
							Enum.EasingDirection.Out,
							Enum.EasingStyle.Quad,
							0.3,
							true,
							undefined,
						);
					});
					wait(0.3);
				}
				wait(1);
				tweenTransparency(container, true, false);
			}
		});
	}
}

export default MenuButtons;
