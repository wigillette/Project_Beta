import Roact from "@rbxts/roact";
import { RectShadow, RectBG, RectText, RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import { googleMaterial, whiteGradientProperties, gradientProperties } from "client/UIProperties/ColorSchemes";
import { SSProperties, circleSSProperties, runSpriteSheet, CircleBG } from "client/UIProperties/Spritesheets";

interface UIProps {
	cap: number;
	Ratio: number;
	Size: UDim2;
	AnchorPoint: Vector2;
	Position: UDim2;
}

class Card extends Roact.Component<UIProps> {
	imageRef;
	progressLabelRef;
	constructor(props: UIProps) {
		super(props);
		this.imageRef = Roact.createRef<ImageLabel>();
		this.progressLabelRef = Roact.createRef<TextLabel>();
	}

	render() {
		return (
			<frame
				Size={this.props.Size}
				AnchorPoint={this.props.AnchorPoint}
				Position={this.props.Position}
				{...RectContainer}
				ZIndex={16}
			>
				<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
				<imagelabel
					ImageColor3={googleMaterial.buttonColor}
					{...SSProperties}
					ZIndex={18}
					Size={new UDim2(0.95, 0, 0.95, 0)}
					Ref={this.imageRef}
				>
					<uigradient {...whiteGradientProperties}></uigradient>
					<textlabel
						{...RectText}
						ZIndex={19}
						TextColor3={googleMaterial.cardFont}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Size={new UDim2(0.5, 0, 0.5, 0)}
						Ref={this.progressLabelRef}
					>
						<uiaspectratioconstraint
							AspectRatio={2}
							DominantAxis={Enum.DominantAxis.Width}
							AspectType={Enum.AspectType.ScaleWithParentSize}
						></uiaspectratioconstraint>
					</textlabel>
				</imagelabel>
				<imagelabel {...CircleBG} ImageColor3={googleMaterial.innerBG} ZIndex={17}>
					<uigradient {...gradientProperties}></uigradient>
				</imagelabel>
			</frame>
		);
	}

	didMount() {
		const image = this.imageRef.getValue();
		const progressLabel = this.progressLabelRef.getValue();
		if (image && progressLabel) {
			runSpriteSheet(
				image,
				progressLabel,
				this.props.Ratio,
				circleSSProperties.spriteAmt,
				circleSSProperties.spriteSize,
				circleSSProperties.grid,
				this.props.cap,
			);
		}
	}

	protected didUpdate(previousProps: UIProps, previousState: {}): void {
		const image = this.imageRef.getValue();
		const progressLabel = this.progressLabelRef.getValue();
		if (image && progressLabel) {
			runSpriteSheet(
				image,
				progressLabel,
				this.props.Ratio,
				circleSSProperties.spriteAmt,
				circleSSProperties.spriteSize,
				circleSSProperties.grid,
				this.props.cap,
			);
		}
	}
}

export default Card;
