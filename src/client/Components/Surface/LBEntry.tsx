import Roact from "@rbxts/roact";
import { RectShadow, RectBG, RectText, RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import { darkMaterial, whiteGradientProperties, gradientProperties } from "client/UIProperties/ColorSchemes";
import { movingFadeAbsolute, tweenPos, tweenTransparency } from "client/UIProperties/FrameEffects";
import { Players } from "@rbxts/services";

interface UIProps {
	playerId: number;
	amount: number;
	rank: number;
}

const rankColors = {
	1: Color3.fromRGB(170, 255, 127),
	2: Color3.fromRGB(136, 136, 136),
	3: Color3.fromRGB(235, 117, 0),
};

class DonationsLB extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame
				Size={new UDim2(1, 0, 0.14, 0)}
				AnchorPoint={new Vector2(0, 0)}
				Position={new UDim2(0, 0, 0, 0)}
				{...RectContainer}
			>
				<imagelabel {...RectBG} ImageColor3={darkMaterial.cardBG}>
					<frame
						Size={new UDim2(0.125, 0, 0.85, 0)}
						Position={new UDim2(0.025, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0, 0.5)}
						ZIndex={1}
						{...RectContainer}
					>
						<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
						<imagelabel
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							Size={new UDim2(0.95, 0, 0.95, 0)}
							BackgroundTransparency={1}
							Image={`https://www.roblox.com/headshot-thumbnail/image?userId=${this.props.playerId}&width=420&height=420&format=png`}
							ZIndex={3}
						></imagelabel>
					</frame>
					<frame
						Size={new UDim2(0.8, 0, 0.85, 0)}
						Position={new UDim2(0.175, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0, 0.5)}
						BackgroundTransparency={1}
						ZIndex={3}
					>
						<textlabel
							AnchorPoint={new Vector2(0, 0)}
							Size={new UDim2(0.15, 0, 0.5, 0)}
							Position={new UDim2(0, 0, 0, 0)}
							TextXAlignment={"Left"}
							TextYAlignment={"Center"}
							Font={"GothamBold"}
							TextScaled={true}
							TextColor3={
								(this.props.rank in rankColors &&
									rankColors[this.props.rank as keyof typeof rankColors]) ||
								Color3.fromRGB(255, 255, 255)
							}
							Text={tostring(this.props.rank)}
							BackgroundTransparency={1}
							ZIndex={4}
						></textlabel>
						<textlabel
							AnchorPoint={new Vector2(0, 0)}
							Size={new UDim2(0.7, 0, 0.7, 0)}
							Position={new UDim2(0, 0, 0.4, 0)}
							TextXAlignment={"Left"}
							TextYAlignment={"Center"}
							Font={"Gotham"}
							Text={Players.GetNameFromUserIdAsync(this.props.playerId) || "None"}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={1}
							ZIndex={4}
						></textlabel>
						<textlabel
							AnchorPoint={new Vector2(0, 0)}
							Size={new UDim2(0.2, 0, 0.7, 0)}
							Position={new UDim2(0.8, 0, 0.22, 0)}
							TextXAlignment={"Left"}
							TextYAlignment={"Center"}
							Font={"Gotham"}
							Text={tostring(this.props.amount)}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={1}
							ZIndex={4}
						></textlabel>
					</frame>
				</imagelabel>
			</frame>
		);
	}
}

export default DonationsLB;
