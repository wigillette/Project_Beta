import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import {
	googleMaterial,
	gradientProperties,
	mediumGradientProperties,
	whiteGradientProperties,
} from "client/UIProperties/ColorSchemes";
import { MenuAspectRatio, RectBG, RectContainer, RectShadow, SquareAspectRatio } from "client/UIProperties/RectUI";
import { CircContainer, CircBG, CircShadow, CircText } from "client/UIProperties/CircularUI";
import RectProgress from "./Material/RectProgress";
import { profileState } from "client/Rodux/Reducers/ProfileReducer";
import { Players } from "@rbxts/services";
import DynamicViewport from "./Material/DynamicViewport";

interface UIProps {
	currentHealth: number;
	maxHealth: number;
	currentExp: number;
	maxExp: number;
}

interface UIState {
	character: Model | undefined;
}

class Profile extends Roact.Component<UIProps, UIState> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Position={new UDim2(0.03, 0, 0.85, 0)}
				Size={new UDim2(0.175, 0, 0.25, 0)}
				AnchorPoint={new Vector2(0.03, 0.85)}
			>
				<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
				<frame
					{...RectContainer}
					Size={new UDim2(0.475, 0, 1, 0)}
					Position={new UDim2(0, 0, 1, 0)}
					AnchorPoint={new Vector2(0, 1)}
				>
					<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
					<imagelabel {...RectBG} ImageColor3={googleMaterial.outerBG}>
						<uigradient {...whiteGradientProperties}></uigradient>
						<DynamicViewport
							Model={undefined}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Size={new UDim2(0.9, 0, 0.9, 0)}
							rotate={false}
							Animation={undefined}
							ZIndex={5}
						></DynamicViewport>
					</imagelabel>
					<imagelabel {...RectShadow} ImageColor3={googleMaterial.outerShadow}></imagelabel>
				</frame>
				<frame
					{...CircContainer}
					Size={new UDim2(0.5, 0, 0.6, 0)}
					Position={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(1, 1)}
				>
					<uilistlayout
						FillDirection={Enum.FillDirection.Vertical}
						Padding={new UDim(0, 10)}
						VerticalAlignment={Enum.VerticalAlignment.Bottom}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
					></uilistlayout>
					<RectProgress
						Title={"Health"}
						Size={new UDim2(1, 0, 0.25, 0)}
						Position={new UDim2(0, 0, 0, 0)}
						AnchorPoint={new Vector2(0, 0)}
						percentage={this.props.currentHealth}
						cap={this.props.maxHealth}
						Color={Color3.fromRGB(170, 0, 0)}
						SeparatorColor={Color3.fromRGB(60, 0, 0)}
					></RectProgress>
					<RectProgress
						Title={"Experience"}
						Size={new UDim2(1, 0, 0.25, 0)}
						Position={new UDim2(0, 0, 0, 0)}
						AnchorPoint={new Vector2(0, 0)}
						percentage={this.props.currentExp}
						cap={this.props.maxExp}
						Color={googleMaterial.buttonColor}
						SeparatorColor={Color3.fromRGB(20, 107, 140)}
					></RectProgress>
				</frame>
			</frame>
		);
	}
}

interface storeState {
	fetchExp: profileState;
}

export = RoactRodux.connect(function (state: storeState) {
	return {
		currentExp: state.fetchExp.currentExp,
		maxExp: state.fetchExp.maxExp,
	};
})(Profile);
