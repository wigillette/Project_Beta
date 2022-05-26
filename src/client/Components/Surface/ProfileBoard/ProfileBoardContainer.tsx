import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Workspace } from "@rbxts/services";
import { registerListDynamicScrolling } from "client/UIProperties/DynamicScrolling";
import { RectContainer, RectText } from "client/UIProperties/RectUI";
import { profileBoardState } from "client/Rodux/Reducers/ProfileBoardReducer";

const leaderboards = Workspace.WaitForChild("MapsBoard", 10) as Folder;
const mapsBoard = leaderboards.WaitForChild("Maps", 10) as Part;

interface UIProps {
	playerViewing: Player;
	playerExp: number;
	playerDeaths: number;
	playerKills: number;
	playerWins: number;
	playerLevel: number;
	switchProfile: (playerInfo: profileBoardState) => void;
}

class ProfileBoardContainer extends Roact.Component<UIProps> {
	scrollRef;
	gridRef;
	connections: RBXScriptConnection[];
	constructor(props: UIProps) {
		super(props);
		this.scrollRef = Roact.createRef<ScrollingFrame>();
		this.gridRef = Roact.createRef<UIListLayout>();
		this.connections = [];
	}

	render() {
		return (
			<surfacegui ResetOnSpawn={true} Adornee={mapsBoard} Face={"Back"} ClipsDescendants={true} Enabled={true}>
				<frame
					{...RectContainer}
					AnchorPoint={new Vector2(0, 0)}
					Size={new UDim2(1, 0, 1, 0)}
					Position={new UDim2(0, 0, 0, 0)}
				></frame>
			</surfacegui>
		);
	}

	protected didMount(): void {
		const grid = this.gridRef.getValue();
		const scroll = this.scrollRef.getValue();
		// Make the scroll frame change size depending on number of items
		if (grid && scroll) {
			const connection = registerListDynamicScrolling(scroll, grid);
			this.connections.push(connection);
		}
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
	switchProfile: profileBoardState;
}

export = RoactRodux.connect(
	function (state: storeState) {
		return {
			playerViewing: state.switchProfile.playerViewing,
			playerKills: state.switchProfile.playerKills,
			playerDeaths: state.switchProfile.playerDeaths,
			playerWins: state.switchProfile.playerWins,
			playerExp: state.switchProfile.playerExp,
			playerLevel: state.switchProfile.playerLevel,
		};
	},
	(dispatch) => {
		return {
			switchProfile: (playerInfo: profileBoardState) => {
				dispatch({
					type: "switchProfile",
					payload: {
						playerViewing: playerInfo.playerViewing,
						playerExp: playerInfo.playerExp,
						playerDeaths: playerInfo.playerDeaths,
						playerKills: playerInfo.playerKills,
						playerWins: playerInfo.playerWins,
						playerLevel: playerInfo.playerLevel,
					},
				});
			},
		};
	},
)(ProfileBoardContainer);
