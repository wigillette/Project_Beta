import Roact from "@rbxts/roact";
import { RectBG, RectContainer, RectShadow, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import { darkMaterial, googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";

interface UIProps {
	icon: string;
	value: number | string;
}

class MatchItem extends Roact.Component<UIProps> {
	textLabelRef;
	constructor(props: UIProps) {
		super(props);
		this.textLabelRef = Roact.createRef<TextLabel>();
	}

	render() {
		return (
			<frame {...RectContainer} Size={new UDim2(0.5, 0, 1, 0)} ZIndex={-1}>
				<textlabel
					{...RectText}
					Position={new UDim2(1, 0, 0, 0)}
					AnchorPoint={new Vector2(1, 0)}
					TextColor3={googleMaterial.cardFont}
					Size={new UDim2(0.52, 0, 1, 0)}
					Ref={this.textLabelRef}
					Text={`${tostring(this.props.value)}`}
					Font={Enum.Font.GothamBold}
					TextXAlignment={Enum.TextXAlignment.Center}
					ZIndex={-1}
				></textlabel>
				<imagelabel
					{...RectContainer}
					ZIndex={-1}
					Image={this.props.icon}
					Size={new UDim2(0.45, 0, 1, 0)}
					Position={new UDim2(0, 0, 0, 0)}
					AnchorPoint={new Vector2(0, 0)}
					ImageColor3={Color3.fromRGB(60, 60, 60)}
				>
					<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
				</imagelabel>

				<uigradient {...whiteGradientProperties}></uigradient>
			</frame>
		);
	}

	protected didUpdate(previousProps: UIProps, previousState: {}): void {
		/*
		const label = this.textLabelRef.getValue();

		if (label) {
			label.Text = tostring(this.props.value);
		}
		*/
	}
}

export default MatchItem;
