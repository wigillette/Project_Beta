import Roact from "@rbxts/roact";
import { RectContainer } from "client/UIProperties/RectUI";
import ArenaTickets from "./ArenaTickets";
import Gold from "./Gold/Gold";
import SpectateButton from "./Spectate/SpectateButton";

class LobbyMenus extends Roact.Component {
	render() {
		return (
			<frame
				{...RectContainer}
				Size={new UDim2(0.125, 0, 0.125, 0)}
				Position={new UDim2(0.02, 0, 0.98, 0)}
				AnchorPoint={new Vector2(0.02, 0.98)}
				BackgroundTransparency={1}
			>
				<SpectateButton size={new UDim2(0.2, 0, 0.45, 0)} position={new UDim2(1, 0, 0, 0)} />
				<ArenaTickets size={new UDim2(0.7, 0, 0.45, 0)} position={new UDim2(0, 0, 0, 0)} />
				<Gold size={new UDim2(1, 0, 0.45, 0)} position={new UDim2(0.5, 0, 1, 0)} />
			</frame>
		);
	}
}

export default LobbyMenus;
