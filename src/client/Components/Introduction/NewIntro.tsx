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
	movingFadeAbsolute,
	movingFade,
} from "client/UIProperties/FrameEffects";
import { RectContainer, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import ObjectUtils from "@rbxts/object-utils";
import RectProgress from "../Material/RectProgress";
import { CircBG, CircContainer } from "client/UIProperties/CircularUI";
import IntroItem from "./IntroItem";
interface UIProps {}

class Intro extends Roact.Component<UIProps> {
	containerRef;
	wordRef;
	creditRef;
	progressBarRef;
	progressFrameRef;

	constructor(props: UIProps) {
		super(props);
		this.containerRef = Roact.createRef<Frame>();
		this.wordRef = Roact.createRef<ImageLabel>();
		this.creditRef = Roact.createRef<TextLabel>();
		this.progressBarRef = Roact.createRef<ImageLabel>();
		this.progressFrameRef = Roact.createRef<Frame>();
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
					Size={new UDim2(1, 0, 1, 0)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
				>
					<uigradient {...mediumGradientProperties}></uigradient>
					<uilistlayout
						FillDirection={"Horizontal"}
						VerticalAlignment={"Center"}
						HorizontalAlignment={"Left"}
						Padding={new UDim(0, 0)}
					></uilistlayout>
					<IntroItem />
					<IntroItem />
					<IntroItem />
					<IntroItem />
					<IntroItem />
					<IntroItem />
					<IntroItem />
					<IntroItem />
					<IntroItem />
					<IntroItem />
				</frame>
				<frame
					{...CircContainer}
					Size={new UDim2(0.8, 0, 0.05, 0)}
					Position={new UDim2(0.5, 0, 0.8, 0)}
					AnchorPoint={new Vector2(0.5, 0.8)}
					Ref={this.progressFrameRef}
					ZIndex={14}
				>
					<uiaspectratioconstraint
						AspectRatio={12}
						DominantAxis={"Width"}
						AspectType={"ScaleWithParentSize"}
					></uiaspectratioconstraint>
					<imagelabel {...CircBG} ImageColor3={googleMaterial.cardBG} ZIndex={15} ImageTransparency={1}>
						<uigradient {...gradientProperties}></uigradient>
						<imagelabel
							{...CircBG}
							Size={new UDim2(0, 0, 0.75, 0)}
							Position={new UDim2(0.015, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0, 0.5)}
							ImageColor3={googleMaterial.buttonColor}
							ZIndex={16}
							ImageTransparency={1}
							Ref={this.progressBarRef}
						>
							<uigradient {...mediumGradientProperties}></uigradient>
						</imagelabel>
					</imagelabel>
				</frame>
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
			</frame>
		);
	}

	protected didMount(): void {
		const word = this.wordRef.getValue();
		const progressBar = this.progressBarRef.getValue();
		const progressFrame = this.progressFrameRef.getValue();
		spawn(() => {
			if (word && word.Parent && progressBar && progressFrame) {
				tweenTransparency(progressFrame, true, true);
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

				movingFade(word.Parent as Frame, false, 0.15, false);
				movingFade(progressFrame, false, -0.15, false);
			}
		});
	}
}

export default Intro;
