import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { RectShadow, RectBG, RippleFrame, RectButtonText, RectContainer } from "client/UIProperties/RectUI";
import { tweenTransparency } from "client/UIProperties/FrameEffects";
import { googleMaterial, gradientProperties, whiteGradientProperties } from "client/UIProperties/ColorSchemes";

interface UIProps {
	placeholderText: string;
	Size: UDim2;
	Position: UDim2;
	AnchorPoint: Vector2;
}

class RectButton extends Roact.Component<UIProps> {
	shadowRef;
	frameRef;
	textboxRef;
	constructor(props: UIProps) {
		super(props);
		this.shadowRef = Roact.createRef<Frame>();
		this.frameRef = Roact.createRef<Frame>();
		this.textboxRef = Roact.createRef<TextBox>();
	}

	render() {
		return (
			<frame
				Ref={this.frameRef}
				{...RectContainer}
				Size={this.props.Size}
				Position={this.props.Position}
				AnchorPoint={this.props.AnchorPoint}
			>
				<uiaspectratioconstraint
					AspectRatio={8}
					DominantAxis={Enum.DominantAxis.Width}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.cardBG} {...RectBG} ZIndex={3}>
					<uigradient {...gradientProperties}></uigradient>
					<textbox
						PlaceholderText={this.props.placeholderText}
						TextStrokeTransparency={0.9}
						{...RectButtonText}
						PlaceholderColor3={googleMaterial.headerFont}
						TextColor3={googleMaterial.headerFont}
						Ref={this.textboxRef}
						Text={""}
						ZIndex={4}
						Event={{
							Focused: () => {
								const shadow = this.shadowRef.getValue() as Frame;
								const textbox = this.textboxRef.getValue() as TextBox;
								if (shadow && textbox) {
									tweenTransparency(shadow, true, true);
									textbox.PlaceholderText = "";
								}
							},
							FocusLost: (rbx: TextBox, enterPressed: boolean) => {
								const shadow = this.shadowRef.getValue() as Frame;
								const textbox = this.textboxRef.getValue() as TextBox;
								if (shadow && textbox) {
									tweenTransparency(shadow, true, false);
									textbox.PlaceholderText = this.props.placeholderText;
									if (enterPressed) {
										print(textbox.Text);
										textbox.Text = "";
									}
								}
							},
						}}
					></textbox>
				</imagelabel>
				<frame
					ZIndex={2}
					Ref={this.shadowRef}
					{...RectContainer}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Size={new UDim2(1, 40, 1, 40)}
				>
					<imagelabel
						ImageColor3={googleMaterial.buttonColor}
						{...RectBG}
						Size={new UDim2(1, -20, 1, -20)}
						ImageTransparency={1}
					>
						<uigradient {...whiteGradientProperties}></uigradient>
					</imagelabel>
					<imagelabel
						ImageColor3={googleMaterial.buttonColor}
						{...RectBG}
						Size={new UDim2(0.6, 0, 0.2, 0)}
						AnchorPoint={new Vector2(0.5, 0)}
						Position={new UDim2(0.5, 0, 0, 0)}
						ImageTransparency={1}
					>
						<textlabel
							{...RectButtonText}
							Text={this.props.placeholderText}
							TextColor3={googleMaterial.headerFont}
							Font={"GothamBold"}
							TextTransparency={1}
							TextStrokeTransparency={0.9}
						></textlabel>
					</imagelabel>
				</frame>

				<imagelabel ImageColor3={googleMaterial.cardFont} {...RectShadow}></imagelabel>
			</frame>
		);
	}
}

export default RectButton;
