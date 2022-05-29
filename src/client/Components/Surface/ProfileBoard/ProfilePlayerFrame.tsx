import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Workspace } from "@rbxts/services";
import RectButton from "client/Components/Material/RectButton";
import { profileBoardState } from "client/Rodux/Reducers/ProfileBoardReducer";
import { FetchBoardData } from "client/Services/ProfileBoardService";
import { darkMaterial } from "client/UIProperties/ColorSchemes";
import { RectBG, RectContainer, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";

const leaderboards = Workspace.WaitForChild("MapsBoard", 10) as Folder;
const mapsBoard = leaderboards.WaitForChild("Maps", 10) as Part;

interface UIProps {
	player: Player;
	switchProfile: (playerInfo: profileBoardState) => void;
}

class Main extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame
				{...RectContainer}
				AnchorPoint={new Vector2(0, 0)}
				Size={new UDim2(1, 0, 0.1, 0)}
				Position={new UDim2(0, 0, 0, 0)}
			>
				<uiaspectratioconstraint
					AspectRatio={3}
					AspectType={"ScaleWithParentSize"}
					DominantAxis="Width"
				></uiaspectratioconstraint>
				<imagelabel {...RectBG} ImageColor3={darkMaterial.cardBG}>
					<textlabel
						{...RectText}
						Text={this.props.player.Name}
						Position={new UDim2(0.95, 0, 0.05, 0)}
						Size={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.95, 0.05)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={"GothamBold"}
						TextStrokeTransparency={0.8}
					></textlabel>
					<imagelabel
						{...RectBG}
						Position={new UDim2(0.05, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.05, 0.5)}
						Size={new UDim2(0.4, 0, 0.95, 0)}
						Image={`https://www.roblox.com/headshot-thumbnail/image?userId=${this.props.player.UserId}&width=420&height=420&format=png`}
					>
						<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
					</imagelabel>
					<RectButton
						Size={new UDim2(0.4, 0, 0.35, 0)}
						Position={new UDim2(0.95, 0, 0.95, 0)}
						AnchorPoint={new Vector2(0.95, 0.95)}
						ButtonText={"VIEW"}
						Callback={() => {
							print(`Viewing ${this.props.player.Name}'s profile!`);
							const userProfile = FetchBoardData(this.props.player);
							if (userProfile) {
								this.props.switchProfile(userProfile);
							}
						}}
					/>
				</imagelabel>
			</frame>
		);
	}
}

export = RoactRodux.connect(undefined, (dispatch) => {
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
					playerCoins: playerInfo.playerCoins,
					playerExpCap: playerInfo.playerExpCap,
					sessionKills: playerInfo.sessionKills,
					sessionDeaths: playerInfo.sessionDeaths,
					sessionWins: playerInfo.sessionWins,
				},
			});
		},
	};
})(Main);
