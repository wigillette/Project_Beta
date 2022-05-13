import Roact from "@rbxts/roact";
import { googleMaterial, whiteGradientProperties, gradientProperties } from "client/UIProperties/ColorSchemes";
import CircButton from "./Material/CircButton";
import { tweenPos, tweenTransparency } from "client/UIProperties/FrameEffects";
import { CircContainer, CircShadow, CircBG, CircText } from "client/UIProperties/CircularUI";

interface UIProps {
	Gold: number;
}

class Interaction extends Roact.Component<UIProps> {
	bodyRef;
	buttonRef;
	frameRef;
	containerRef;
	constructor(props: UIProps) {
		super(props);
		this.bodyRef = Roact.createRef<TextLabel>();
		this.buttonRef = Roact.createRef<ImageButton>();
		this.frameRef = Roact.createRef<Frame>();
		this.containerRef = Roact.createRef<Frame>();
	}

	render() {
		return (
			<frame
				Size={new UDim2(0.125, 0, 0.125, 0)}
				AnchorPoint={new Vector2(0.025, 0.975)}
				Position={new UDim2(0.025, 0, 0.975, 0)}
				Ref={this.containerRef}
				{...CircContainer}
			>
				<uiaspectratioconstraint
					AspectRatio={5}
					DominantAxis={Enum.DominantAxis.Width}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.outerBG} {...CircBG}>
					<uigradient {...whiteGradientProperties}></uigradient>
					<textlabel
						{...CircText}
						Position={new UDim2(0.1, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.1, 0.5)}
						Size={new UDim2(0.35, 0, 0.9, 0)}
						Font={"GothamBold"}
						Text={"Gold:"}
					></textlabel>
					<textlabel
						{...CircText}
						Position={new UDim2(0.6, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Size={new UDim2(0.3, 0, 0.8, 0)}
						Font={"Gotham"}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Bottom}
						TextColor3={Color3.fromRGB(65, 65, 65)}
						Text={tostring(this.props.Gold)}
					></textlabel>
					<CircButton
						Position={new UDim2(0.9, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.9, 0.5)}
						Size={new UDim2(0.15, 0, 0.15, 0)}
						Callback={() => {
							print("Display Gold Shop");
						}}
					></CircButton>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.outerShadow} {...CircShadow}></imagelabel>
			</frame>
		);
	}
}

export default Interaction;
