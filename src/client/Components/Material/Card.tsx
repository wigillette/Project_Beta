import Roact from "@rbxts/roact";
import { RectShadow, RectBG, RectText, RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import RectButton from "./RectButton";
import DynamicViewport from "./DynamicViewport";

interface UIProps {
	Text: string;
	ButtonText: string;
	Callback: () => void;
	Model: Model | Tool;
}

class Card extends Roact.Component<UIProps> {
	labelRef;
	buttonRef;
	frameRef;
	containerRef;
	constructor(props: UIProps) {
		super(props);
		this.labelRef = Roact.createRef<TextLabel>();
		this.buttonRef = Roact.createRef<ImageButton>();
		this.frameRef = Roact.createRef<Frame>();
		this.containerRef = Roact.createRef<Frame>();
	}

	render() {
		return (
			<frame
				Size={new UDim2(0.25, 0, 0.25, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Ref={this.containerRef}
				{...RectContainer}
			>
				<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.outerBG} {...RectBG}>
					<textlabel
						Text={this.props.Text}
						AnchorPoint={new Vector2(0.5, 0.05)}
						Position={new UDim2(0.5, 0, 0.05, 0)}
						Size={new UDim2(0.95, 0, 0.25, 0)}
						TextColor3={googleMaterial.cardFont}
						{...RectText}
						Font={"GothamBold"}
					></textlabel>

					<DynamicViewport
						rotate={true}
						Model={this.props.Model}
						Position={new UDim2(0.5, 0, 0.525, 0)}
						Size={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						ZIndex={3}
					/>
					<RectButton
						Position={new UDim2(0.5, 0, 0.95, 0)}
						AnchorPoint={new Vector2(0.5, 0.95)}
						Size={new UDim2(0.25, 0, 0.25, 0)}
						ButtonText={this.props.ButtonText}
						Callback={this.props.Callback}
					/>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.outerShadow} {...RectShadow}></imagelabel>
			</frame>
		);
	}
}

export default Card;
