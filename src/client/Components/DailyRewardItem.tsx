import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import {
	Body,
	CardGridLayout,
	Header,
	MenuAspectRatio,
	RectBG,
	RectContainer,
	RectShadow,
	RectText,
	SquareAspectRatio,
} from "client/UIProperties/RectUI";
import {
	darkMaterial,
	googleMaterial,
	mediumGradientProperties,
	whiteGradientProperties,
} from "client/UIProperties/ColorSchemes";
import { movingFadeAbsolute } from "../UIProperties/FrameEffects";

interface UIProps {
	day: number;
	rewardAmount: number;
	locked: boolean;
	icon: string;
}

class DailyReward extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame {...RectContainer} Size={new UDim2(0.225, 0, 1, 0)}>
				<imagelabel {...RectBG} ZIndex={2} ImageColor3={googleMaterial.cardBG}>
					<textlabel
						{...RectText}
						Position={new UDim2(0.5, 0, 0.05, 0)}
						AnchorPoint={new Vector2(0.5, 0.05)}
						TextColor3={googleMaterial.cardFont}
						Size={new UDim2(0.9, 0, 0.25, 0)}
						Text={`Day ${tostring(this.props.day)}`}
						Font={Enum.Font.GothamBold}
						TextXAlignment={Enum.TextXAlignment.Center}
						ZIndex={3}
					></textlabel>
					<imagelabel
						{...RectContainer}
						ZIndex={3}
						Image={this.props.icon}
						Size={new UDim2(0.4, 0, 0.3, 0)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
					>
						<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
					</imagelabel>
					<textlabel
						{...RectText}
						Position={new UDim2(0.5, 0, 0.95, 0)}
						AnchorPoint={new Vector2(0.5, 0.95)}
						TextColor3={googleMaterial.cardFont}
						Size={new UDim2(0.9, 0, 0.25, 0)}
						Text={tostring(this.props.rewardAmount)}
						TextXAlignment={Enum.TextXAlignment.Center}
						ZIndex={3}
					></textlabel>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel {...RectShadow} ZIndex={1} ImageColor3={googleMaterial.cardShadow}></imagelabel>
				<frame
					{...RectContainer}
					Key={"Lock"}
					Size={new UDim2(1, 0, 1, 3)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					ZIndex={4}
					Visible={this.props.locked}
				>
					<imagelabel
						Key={"Lock"}
						{...RectBG}
						ZIndex={5}
						ImageTransparency={0.6}
						ImageColor3={darkMaterial.outerBG}
					>
						<imagelabel
							{...RectBG}
							ZIndex={5}
							Size={new UDim2(0.5, 0, 0.5, 0)}
							Image={"rbxassetid://6088994136"}
						>
							<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
						</imagelabel>
					</imagelabel>
				</frame>
			</frame>
		);
	}
}

export default DailyReward;
