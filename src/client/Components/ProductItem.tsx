import Roact from "@rbxts/roact";
import { RectBG, RectContainer, RectShadow, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import { darkMaterial, googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";

interface UIProps {
	icon: string;
	title: string;
	description: string;
}

class MatchItem extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame {...RectContainer} Size={new UDim2(0.5, 0, 1, 0)} ZIndex={-1}>
				<imagelabel {...RectBG} ImageColor3={googleMaterial.cardBG}>
					<textlabel
						{...RectText}
						Position={new UDim2(1, 0, 0, 0)}
						AnchorPoint={new Vector2(1, 0)}
						TextColor3={googleMaterial.cardFont}
						Size={new UDim2(0.75, 0, 0.25, 0)}
						Text={`${tostring(this.props.title)}`}
						Font={Enum.Font.GothamBold}
						TextXAlignment={Enum.TextXAlignment.Center}
					></textlabel>
					<imagelabel
						{...RectContainer}
						Image={this.props.icon}
						Size={new UDim2(0.25, 0, 1, 0)}
						Position={new UDim2(0, 0, 0, 0)}
						AnchorPoint={new Vector2(0, 0)}
						ImageColor3={Color3.fromRGB(60, 60, 60)}
					>
						<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
					</imagelabel>
					<textlabel
						{...RectText}
						Position={new UDim2(1, 0, 1, 0)}
						AnchorPoint={new Vector2(1, 1)}
						Size={new UDim2(0.6, 0, 0.7, 0)}
						Text={`${tostring(this.props.description)}`}
						TextXAlignment={Enum.TextXAlignment.Center}
						TextYAlignment={Enum.TextYAlignment.Bottom}
					></textlabel>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel {...RectShadow} ImageColor3={googleMaterial.cardShadow}></imagelabel>
			</frame>
		);
	}
}

export default MatchItem;
