import Roact from "@rbxts/roact";
import { googleMaterial } from "client/UIProperties/ColorSchemes";
import { RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import SquareButton from "./Material/SquareButton";
import SettingsService from "../Services/SettingsService";
import ToggleButton from "./Material/ToggleButton";
import { SETTINGS_FORMAT } from "shared/SettingsInfo";
import RoactRodux from "@rbxts/roact-rodux";
import { settingsState } from "client/Rodux/Reducers/SettingsReducer";

interface UIProps {
	size: UDim2;
	position: UDim2;
	settings: SETTINGS_FORMAT;
}

class PlayingButton extends Roact.Component<UIProps> {
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
					DominantAxis={Enum.DominantAxis.Width}
				></uiaspectratioconstraint>
				{/* change to icon button*/}
				<ToggleButton
					Title={"Playing"}
					Position={new UDim2(0, 0, 0, 0)}
					Size={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0, 0)}
					initialToggle={this.props.settings.Playing}
					onClick={(state: boolean) => {
						SettingsService.ChangeSetting("Playing", state);
					}}
				></ToggleButton>
			</frame>
		);
	}
}

interface storeState {
	toggleSettings: settingsState;
	setSettingsToggle: settingsState;
	updateSettings: settingsState;
}

export = RoactRodux.connect((state: storeState) => {
	return {
		toggle: state.toggleSettings.toggle,
		settings: state.updateSettings.settings,
	};
})(PlayingButton);
