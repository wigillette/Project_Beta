import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { RectContainer } from "client/UIProperties/RectUI";
import { mediumGradientProperties } from "client/UIProperties/ColorSchemes";
import { tweenTransparency } from "../../UIProperties/FrameEffects";
import ObjectUtils from "@rbxts/object-utils";
import { registerListDynamicScrolling } from "../../UIProperties/DynamicScrolling";
import PlayerListItem from "./PlayerListItem";
import { Players, StarterGui } from "@rbxts/services";
import { playerListState } from "client/Rodux/Reducers/PlayerListReducer";

interface UIProps {
	players: Player[];
	updatePlayers: (players: Player[]) => void;
}

class PlayerList extends Roact.Component<UIProps> {
	listRef;
	scrollRef;
	connections: RBXScriptConnection[];
	constructor(props: UIProps) {
		super(props);
		this.listRef = Roact.createRef<UIListLayout>();
		this.scrollRef = Roact.createRef<ScrollingFrame>();
		this.connections = [];
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Position={new UDim2(0.975, 0, 0.025, 0)}
				AnchorPoint={new Vector2(0.95, 0.05)}
				Size={new UDim2(0.15, 0, 0.3, 0)}
			>
				<uiaspectratioconstraint
					DominantAxis={Enum.DominantAxis.Height}
					AspectRatio={0.7}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint>
				<scrollingframe
					Size={new UDim2(1, 0, 1, 0)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Ref={this.scrollRef}
				>
					<uilistlayout
						Ref={this.listRef}
						FillDirection={Enum.FillDirection.Vertical}
						VerticalAlignment={Enum.VerticalAlignment.Top}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						Padding={new UDim(0, 10)}
					></uilistlayout>
					{ObjectUtils.values(this.props.players).map((player) => {
						return <PlayerListItem player={player} />;
					})}
				</scrollingframe>
			</frame>
		);
	}

	protected didMount(): void {
		StarterGui.SetCoreGuiEnabled("PlayerList", false);
		const list = this.listRef.getValue();
		const scroll = this.scrollRef.getValue();
		// Make the scroll frame change size depending on number of items
		if (list && scroll) {
			const connection = registerListDynamicScrolling(scroll, list);
			this.connections.push(connection);
		}

		// Dispatch to the rodux store the current player list
		this.props.updatePlayers(Players.GetPlayers());
		this.connections.push(
			Players.PlayerAdded.Connect((player: Player) => {
				const players = Players.GetPlayers();
				this.props.updatePlayers(players);
				// Dispatch to the rodux store the new player list
			}),
		);

		this.connections.push(
			Players.PlayerAdded.Connect((player: Player) => {
				const players = Players.GetPlayers();
				this.props.updatePlayers(players);
				// Dispatch to the rodux store the old player list
			}),
		);
	}

	protected willUnmount(): void {
		// Disconnect the scroll frame listener
		this.connections.forEach((connection) => {
			connection.Disconnect();
		});
		this.connections.clear();
	}
}

interface storeState {
	updatePlayers: playerListState;
}

export = RoactRodux.connect(
	function (state: storeState) {
		return {
			players: state.updatePlayers.players,
		};
	},
	(dispatch) => {
		return {
			updatePlayers: (players: Player[]) => {
				dispatch({
					type: "updatePlayers",
					payload: { players: players },
				});
			},
		};
	},
)(PlayerList);
