import Roact from "@rbxts/roact";
import { RectShadow, RectBG, RectText, RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import { darkMaterial, googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import RectButton from "./Material/RectButton";
import DynamicViewport from "./Material/DynamicViewport";
import { tweenPos, tweenTransparency } from "client/UIProperties/FrameEffects";

interface UIProps {
	Header: string;
	Body: string;
	Model: Model | Tool;
}

class Card extends Roact.Component<UIProps> {
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
				Size={new UDim2(0.25, 0, 0.25, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.6, 0)}
				Ref={this.containerRef}
				{...RectContainer}
			>
				<uiaspectratioconstraint
					AspectRatio={4}
					DominantAxis={Enum.DominantAxis.Width}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint>
				<imagelabel ImageColor3={darkMaterial.outerBG} {...RectBG}>
					<textlabel
						Text={this.props.Header}
						AnchorPoint={new Vector2(0.5, 0.05)}
						Position={new UDim2(0.51, 0, 0.05, 0)}
						Size={new UDim2(0.5, 0, 0.25, 0)}
						TextColor3={darkMaterial.cardFont}
						{...RectText}
						Font={"GothamBold"}
					></textlabel>
					<textlabel
						Text={""}
						Ref={this.bodyRef}
						AnchorPoint={new Vector2(0.9, 0.9)}
						Position={new UDim2(0.9, 0, 0.9, 0)}
						Size={new UDim2(0.7, 0, 0.65, 0)}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextColor3={darkMaterial.cardFont}
						{...RectText}
					></textlabel>
					<frame
						Position={new UDim2(0.015, 0, 0.59, 0)}
						Size={new UDim2(0.225, 0, 0.25, 0)}
						AnchorPoint={new Vector2(0, 0.6)}
						ZIndex={0}
						{...RectContainer}
					>
						<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
						<imagelabel ImageColor3={darkMaterial.cardBG} {...RectBG} ZIndex={2}>
							<DynamicViewport
								rotate={false}
								Model={this.props.Model}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								Size={new UDim2(0.95, 0, 0.95, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								ZIndex={2}
							/>
						</imagelabel>
						<imagelabel ImageColor3={darkMaterial.cardShadow} {...RectShadow} ZIndex={1}></imagelabel>
					</frame>

					<RectButton
						ButtonText={"EXIT"}
						Callback={() => {
							// Remove the interaction UI
							const container = this.containerRef.getValue();
							if (container) {
								coroutine.wrap(() => {
									tweenTransparency(container, true, false);
									tweenPos(container, "Up", 0.15);
									wait(0.4);
									container.Destroy();
								})();
							}
						}}
						Position={new UDim2(0.95, 0, 0.05, 0)}
						Size={new UDim2(0.15, 0, 0.25, 0)}
						AnchorPoint={new Vector2(0.9, 0)}
					/>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel ImageColor3={darkMaterial.outerShadow} {...RectShadow}></imagelabel>
			</frame>
		);
	}

	protected didMount(): void {
		const container = this.containerRef.getValue();
		const body = this.bodyRef.getValue();
		if (container && body) {
			coroutine.wrap(() => {
				tweenTransparency(container, true, false);
				container.Visible = false;
				wait(0.4);
				container.Visible = true;
				tweenTransparency(container, true, true);
				tweenPos(container, "Down", 0.15);

				for (let i = 0; i < this.props.Body.size(); i++) {
					body.Text += this.props.Body.sub(i, i);
					wait(0.03);
				}
			})();
		}
	}
}

export default Card;
