import { KnitClient } from "@rbxts/knit";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { googleMaterial } from "client/UIProperties/ColorSchemes";
import { RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import SquareButton from "../Material/SquareButton";
interface UIProps {
	toggleSpectate: () => void;
	size: UDim2;
	position: UDim2;
}

const matchService = KnitClient.GetService("MatchService");

class SpectateButton extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Size={this.props.size}
				Position={this.props.position}
				AnchorPoint={new Vector2(this.props.position.X.Scale, this.props.position.Y.Scale)}
			>
				<uiaspectratioconstraint
					{...SquareAspectRatio}
					DominantAxis={Enum.DominantAxis.Height}
				></uiaspectratioconstraint>
				<SquareButton
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Size={new UDim2(1, 0, 1, 0)}
					IconColor={Color3.fromRGB(255, 255, 255)}
					ButtonIcon={"rbxassetid://9761793117"}
					ButtonColor={googleMaterial.buttonColor}
					HoverColor={googleMaterial.buttonHover}
					ShadowColor={Color3.fromRGB(26, 51, 69)}
					Callback={() => {
						if (matchService.CanSpectate() === true) {
							this.props.toggleSpectate();
						}
					}}
					HoverText={"Spectate"}
				/>
			</frame>
		);
	}
}

export = RoactRodux.connect(undefined, (dispatch) => {
	return {
		toggleSpectate: () => {
			dispatch({
				type: "toggleSpectate",
			});
		},
	};
})(SpectateButton);
