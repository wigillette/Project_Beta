import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { RectBG, RectContainer, RectShadow, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import RectButton from "../Material/RectButton";
import { Players } from "@rbxts/services";
import DynamicViewport from "../Material/DynamicViewport";

interface UIProps {
	modeName: string;
	modeDescription: string;
	setChosenMode: (mode: string) => void;
	buttonText: string;
}

class ModeItem extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame {...RectContainer} Size={new UDim2(0.3, 0, 1, 0)} ZIndex={-1}>
				<imagelabel {...RectBG} ImageColor3={googleMaterial.cardBG}>
					<textlabel
						{...RectText}
						Position={new UDim2(0.5, 0, 0.05, 0)}
						AnchorPoint={new Vector2(0.5, 0.05)}
						TextColor3={googleMaterial.cardFont}
						Size={new UDim2(0.95, 0, 0.15, 0)}
						Text={this.props.modeName}
						Font={Enum.Font.GothamBold}
						TextXAlignment={Enum.TextXAlignment.Center}
					></textlabel>

					<textlabel
						{...RectText}
						Position={new UDim2(0.5, 0, 0.35, 0)}
						AnchorPoint={new Vector2(0.5, 0.35)}
						TextColor3={googleMaterial.cardFont}
						Size={new UDim2(0.8, 0, 0.45, 0)}
						Text={this.props.modeDescription}
						Font={Enum.Font.Gotham}
						TextXAlignment={Enum.TextXAlignment.Center}
					></textlabel>

					<RectButton
						ButtonText={this.props.buttonText}
						Size={new UDim2(0.6, 0, 0.3, 0)}
						Position={new UDim2(0.5, 0, 0.95, 0)}
						AnchorPoint={new Vector2(0.5, 0.95)}
						Callback={() => {
							this.props.setChosenMode(this.props.modeName);
						}}
					/>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel {...RectShadow} ImageColor3={googleMaterial.cardShadow}></imagelabel>
			</frame>
		);
	}
}

export = RoactRodux.connect(undefined, (dispatch) => {
	return {
		setChosenMode: (mode: string) => {
			dispatch({
				type: "setChosenMode",
				payload: { chosenMode: mode },
			});
		},
	};
})(ModeItem);
