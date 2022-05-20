import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { RectBG, RectContainer, RectShadow, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import RectButton from "../Material/RectButton";
import DynamicViewport from "../Material/DynamicViewport";

interface UIProps {
	mapName: string;
	mapModel: Model | undefined;
	setChosenMap: (map: string) => void;
	buttonText: string;
}

class MapItem extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame {...RectContainer} Size={new UDim2(0.5, 0, 1, 0)} ZIndex={-1}>
				<imagelabel {...RectBG} ImageColor3={googleMaterial.cardBG}>
					<textlabel
						{...RectText}
						Position={new UDim2(0.5, 0, 0.05, 0)}
						AnchorPoint={new Vector2(0.5, 0.05)}
						TextColor3={googleMaterial.cardFont}
						Size={new UDim2(0.95, 0, 0.25, 0)}
						Text={this.props.mapName}
						Font={Enum.Font.GothamBold}
						TextXAlignment={Enum.TextXAlignment.Center}
					></textlabel>
					<DynamicViewport
						Position={new UDim2(0.5, 0, 0.5, 0)}
						Size={new UDim2(0.55, 0, 0.55, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						rotate={true}
						ZIndex={15}
						Animation={undefined}
						viewDistance={-1000}
						Model={this.props.mapModel}
					/>

					<RectButton
						ButtonText={this.props.buttonText}
						Size={new UDim2(0.6, 0, 0.3, 0)}
						Position={new UDim2(0.5, 0, 0.95, 0)}
						AnchorPoint={new Vector2(0.5, 0.95)}
						Callback={() => {
							this.props.setChosenMap(this.props.mapName);
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
		setChosenMap: (map: string) => {
			dispatch({
				type: "setChosenMap",
				payload: { chosenMap: map },
			});
		},
	};
})(MapItem);
