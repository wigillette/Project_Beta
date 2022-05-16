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
} from "client/UIProperties/RectUI";
import { mediumGradientProperties } from "client/UIProperties/ColorSchemes";
import { movingFadeAbsolute } from "../UIProperties/FrameEffects";
import { settingsState } from "client/Rodux/Reducers/SettingsReducer";
import SettingsService from "../Services/SettingsService";
import { SETTINGS_FORMAT } from "shared/SettingsInfo";
import ObjectUtils from "@rbxts/object-utils";
import ToggleButton from "./Material/ToggleButton";

interface UIProps {
	toggle: boolean;
	settings: SETTINGS_FORMAT;
}

const settingsRef = Roact.createRef<Frame>();
let oldFadeIn = true;
class Settings extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={new UDim2(0.5, 0, 0.6, 0)}
				Ref={settingsRef}
			>
				<uiaspectratioconstraint
					DominantAxis={Enum.DominantAxis.Height}
					AspectRatio={0.9}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint>
				<imagelabel {...RectBG} ImageColor3={Color3.fromRGB(70, 70, 70)}>
					<frame {...Header}>
						<textlabel
							{...RectText}
							Font={Enum.Font.GothamBold}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Size={new UDim2(0.6, 0, 1, 0)}
							Text={"Settings"}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						></textlabel>
					</frame>

					<frame {...Body}>
						<uigridlayout
							{...CardGridLayout}
							FillDirectionMaxCells={2}
							CellPadding={new UDim2(0.03, 0, 0.1, 0)}
							CellSize={new UDim2(0.45, 0, 0.3, 0)}
						></uigridlayout>
						{ObjectUtils.entries(this.props.settings).map((settings) => {
							return (
								<ToggleButton
									Title={settings[0]}
									Position={new UDim2(0, 0, 0, 0)}
									Size={new UDim2(0.5, 0, 0.5, 0)}
									AnchorPoint={new Vector2(0, 0)}
									initialToggle={settings[1]}
									onClick={(state: boolean) => {
										SettingsService.ChangeSetting(settings[0], state);
									}}
								></ToggleButton>
							);
						})}
					</frame>
					<uigradient {...mediumGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel {...RectShadow} ImageColor3={Color3.fromRGB(30, 30, 30)}></imagelabel>
			</frame>
		);
	}
}

interface storeState {
	toggleSettings: settingsState;
	setSettingsToggle: settingsState;
	updateSettings: settingsState;
}

export = RoactRodux.connect(function (state: storeState) {
	const settingsFrame = settingsRef.getValue() as Frame;
	if (settingsFrame && state.toggleSettings.toggle !== oldFadeIn) {
		oldFadeIn = state.toggleSettings.toggle;
		// Update the frame's position when the toggle changes
		state.toggleSettings.toggle
			? movingFadeAbsolute(settingsFrame, true, new UDim2(0.5, 0, 0.4, 0), true)
			: movingFadeAbsolute(settingsFrame, false, new UDim2(0.5, 0, 0.1, 0), true);
	}

	return {
		toggle: state.toggleSettings.toggle,
		settings: state.updateSettings.settings,
	};
})(Settings);
