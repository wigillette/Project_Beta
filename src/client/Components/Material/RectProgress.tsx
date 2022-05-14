import Roact from "@rbxts/roact";
import { CircShadow, CircBG, CircContainer, CircText, SeparatorProperties } from "client/UIProperties/CircularUI";
import { googleMaterial, gradientProperties, whiteGradientProperties } from "client/UIProperties/ColorSchemes";

interface UIProps {
	Title: string;
	Size: UDim2;
	Position: UDim2;
	AnchorPoint: Vector2;
	percentage: number;
	cap: number;
	Color: Color3;
	SeparatorColor: Color3;
}

class RectProgress extends Roact.Component<UIProps> {
	shadowRef;
	frameRef;
	buttonRef;
	textRef;

	constructor(props: UIProps) {
		super(props);
		this.shadowRef = Roact.createRef<ImageLabel>();
		this.frameRef = Roact.createRef<Frame>();
		this.buttonRef = Roact.createRef<Frame>();
		this.textRef = Roact.createRef<TextLabel>();
	}

	render() {
		return (
			<frame
				Ref={this.frameRef}
				{...CircContainer}
				Size={this.props.Size}
				Position={this.props.Position}
				AnchorPoint={this.props.AnchorPoint}
			>
				<uiaspectratioconstraint
					AspectRatio={8}
					DominantAxis={Enum.DominantAxis.Width}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint>

				<imagelabel ImageColor3={googleMaterial.cardBG} {...CircBG} ZIndex={0}>
					<uigradient {...gradientProperties}></uigradient>

					<imagelabel
						Ref={this.shadowRef}
						ImageColor3={this.props.Color}
						{...CircBG}
						Size={new UDim2(this.props.percentage / this.props.cap, 0, 1, 0)}
						Position={new UDim2(0, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0, 0.5)}
					>
						<uigradient {...gradientProperties}></uigradient>
					</imagelabel>

					<textlabel
						{...CircText}
						Font={Enum.Font.GothamBold}
						Size={new UDim2(0.45, 0, 0.9, 0)}
						AnchorPoint={new Vector2(0, 0.5)}
						Position={new UDim2(0.05, 0, 0.5, 0)}
						ZIndex={3}
						Text={this.props.Title}
						TextStrokeTransparency={0.9}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					></textlabel>
					<textlabel
						{...CircText}
						Font={Enum.Font.GothamBold}
						Size={new UDim2(0.45, 0, 0.9, 0)}
						AnchorPoint={new Vector2(1, 0.5)}
						Position={new UDim2(0.95, 0, 0.5, 0)}
						ZIndex={3}
						Text={`${tostring(math.round((this.props.percentage / this.props.cap) * 100))}/${tostring(
							this.props.cap,
						)}`}
						TextStrokeTransparency={0.9}
						TextXAlignment={Enum.TextXAlignment.Right}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					></textlabel>
					<frame
						{...SeparatorProperties}
						Visible={this.props.percentage / this.props.cap >= 0.3}
						BackgroundColor3={this.props.SeparatorColor}
						AnchorPoint={new Vector2(0.2, 0.5)}
						Position={new UDim2(0.2, 0, 0.5, 0)}
					></frame>
					<frame
						{...SeparatorProperties}
						Visible={this.props.percentage / this.props.cap >= 0.5}
						BackgroundColor3={this.props.SeparatorColor}
						AnchorPoint={new Vector2(0.4, 0.5)}
						Position={new UDim2(0.4, 0, 0.5, 0)}
					></frame>
					<frame
						{...SeparatorProperties}
						Visible={this.props.percentage / this.props.cap >= 0.7}
						BackgroundColor3={this.props.SeparatorColor}
						AnchorPoint={new Vector2(0.6, 0.5)}
						Position={new UDim2(0.6, 0, 0.5, 0)}
					></frame>
					<frame
						{...SeparatorProperties}
						Visible={this.props.percentage / this.props.cap >= 0.9}
						BackgroundColor3={this.props.SeparatorColor}
						AnchorPoint={new Vector2(0.8, 0.5)}
						Position={new UDim2(0.8, 0, 0.5, 0)}
					></frame>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.cardFont} {...CircShadow} ZIndex={-1}></imagelabel>
			</frame>
		);
	}
}

export default RectProgress;
