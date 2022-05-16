import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Body, Header, MenuAspectRatio, RectBG, RectContainer, RectShadow, RectText } from "client/UIProperties/RectUI";
import { mediumGradientProperties } from "client/UIProperties/ColorSchemes";
import Textbox from "./Material/Textbox";
import { movingFadeAbsolute } from "../UIProperties/FrameEffects";
import { twitterState } from "client/Rodux/Reducers/TwitterReducer";
import TwitterService from "../Services/TwitterService";

interface UIProps {
	toggle: boolean;
}

let oldFadeIn = true;
const twitterRef = Roact.createRef<Frame>();
class Twitter extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={new UDim2(0.25, 0, 0.25, 0)}
				Ref={twitterRef}
			>
				<uiaspectratioconstraint {...MenuAspectRatio}></uiaspectratioconstraint>
				<imagelabel {...RectBG} ImageColor3={Color3.fromRGB(122, 122, 171)}>
					<frame {...Header}>
						<textlabel
							{...RectText}
							Font={Enum.Font.GothamBold}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Size={new UDim2(0.6, 0, 1, 0)}
							Text={"Twitter"}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						></textlabel>
					</frame>

					<frame {...Body}>
						<textlabel
							{...RectText}
							Size={new UDim2(0.9, 0, 0.6, 0)}
							AnchorPoint={new Vector2(0.5, 0)}
							Position={new UDim2(0.5, 0, 0, 0)}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Text={"Enter a twitter code found on the Project Beta Twitter: @SolationsRBLX"}
						></textlabel>
						<Textbox
							placeholderText={"Enter a code!"}
							Size={new UDim2(0.8, 0, 0.25, 0)}
							Position={new UDim2(0.5, 0, 0.9, 0)}
							AnchorPoint={new Vector2(0.5, 0.9)}
							onEnter={(text: string) => {
								TwitterService.RedeemCode(text);
							}}
						></Textbox>
					</frame>
					<uigradient {...mediumGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel {...RectShadow} ImageColor3={Color3.fromRGB(79, 79, 112)}></imagelabel>
			</frame>
		);
	}
}

interface storeState {
	toggleTwitter: twitterState;
}

export = RoactRodux.connect(function (state: storeState) {
	const twitterFrame = twitterRef.getValue() as Frame;
	if (twitterFrame && state.toggleTwitter.toggle !== oldFadeIn) {
		oldFadeIn = state.toggleTwitter.toggle;
		// Update the frame's position when the toggle changes
		state.toggleTwitter.toggle
			? movingFadeAbsolute(twitterFrame, true, new UDim2(0.5, 0, 0.4, 0), true)
			: movingFadeAbsolute(twitterFrame, false, new UDim2(0.5, 0, 0.1, 0), true);
	}

	return {
		toggle: state.toggleTwitter.toggle,
	};
})(Twitter);
