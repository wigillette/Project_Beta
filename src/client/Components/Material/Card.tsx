import Roact from "@rbxts/roact";
import { RectShadow, RectBG, RectText, RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import RectButton from "./RectButton";
import DynamicViewport from "./DynamicViewport";
import { tweenTransparency } from "client/UIProperties/FrameEffects";

interface UIProps {
	Text: string;
	ButtonText: string;
	Callback: () => void;
	Model: Model | Tool;
	Size?: UDim2;
	ButtonSize: UDim2;
	noCallback?: boolean;
}

interface UIState {
	response: string;
}

class Card extends Roact.Component<UIProps, UIState> {
	labelRef;
	buttonRef;
	frameRef;
	containerRef;

	state = {
		response: "",
	};

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
				Size={this.props.Size || new UDim2(0.25, 0, 0.25, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Ref={this.containerRef}
				Key={"Card"}
				{...RectContainer}
			>
				<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.cardBG} {...RectBG}>
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
						Animation={undefined}
					/>
					{!this.props.noCallback && (
						<RectButton
							Position={new UDim2(0.5, 0, 0.95, 0)}
							AnchorPoint={new Vector2(0.5, 0.95)}
							Size={this.props.ButtonSize}
							ButtonText={this.props.ButtonText}
							Callback={this.props.Callback}
						/>
					)}
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.cardShadow} {...RectShadow}></imagelabel>
			</frame>
		);
	}

	protected didMount(): void {
		const container = this.containerRef.getValue();

		if (container) {
			coroutine.wrap(() => {
				container.Visible = false;
				tweenTransparency(container, true, false);
				wait(0.35);
				container.Visible = true;
				tweenTransparency(container, true, true);
				container.Visible = true;
			})();
		}
	}
}

export default Card;
