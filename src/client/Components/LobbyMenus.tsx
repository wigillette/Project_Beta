import Roact from "@rbxts/roact";
import SettingsClient from "client/Services/SettingsService";
import { googleMaterial } from "client/UIProperties/ColorSchemes";
import { RectContainer } from "client/UIProperties/RectUI";
import ArenaTickets from "./ArenaTickets";
import Gold from "./Gold/Gold";
import IconToggle from "./Material/IconToggle";
import SpectateButton from "./Spectate/SpectateButton";

class LobbyMenus extends Roact.Component {
	render() {
		return (
			<frame
				{...RectContainer}
				Size={new UDim2(0.125, 0, 0.1, 0)}
				Position={new UDim2(0.02, 0, 0.98, 0)}
				AnchorPoint={new Vector2(0.02, 0.98)}
				BackgroundTransparency={1}
			>
				<frame {...RectContainer} Size={new UDim2(1, 0, 0.45, 0)} Position={new UDim2(0, 0, 0, 0)}>
					<ArenaTickets size={new UDim2(0.55, 0, 1, 0)} position={new UDim2(0, 0, 0, 0)} />
					<SpectateButton size={new UDim2(0.175, 0, 1, 0)} position={new UDim2(0.75, 0, 0, 0)} />
					<IconToggle
						ButtonIcon="rbxassetid://4222968932"
						EnabledColor={Color3.fromRGB(0, 200, 0)}
						DisabledColor={Color3.fromRGB(200, 0, 0)}
						ButtonColor={googleMaterial.buttonColor}
						HoverColor={googleMaterial.buttonHover}
						ShadowColor={Color3.fromRGB(26, 51, 69)}
						onClick={(state: boolean) => {
							SettingsClient.ChangeSetting("Playing", state);
						}}
						Position={new UDim2(1, 0, 0, 0)}
						AnchorPoint={new Vector2(1, 0)}
						HoverText={"Playing"}
						Size={new UDim2(0.175, 0, 1, 0)}
					/>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						Padding={new UDim(0.05, 0)}
					></uilistlayout>
				</frame>

				<Gold size={new UDim2(1, 0, 0.45, 0)} position={new UDim2(0, 0, 1, 0)} />
			</frame>
		);
	}
}

export default LobbyMenus;
