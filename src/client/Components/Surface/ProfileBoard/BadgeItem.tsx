import Roact from "@rbxts/roact";
import { BadgeService, MarketplaceService, Workspace } from "@rbxts/services";
import { darkMaterial } from "../../..//UIProperties/ColorSchemes";
import { RectBG, RectContainer, RectText, SquareAspectRatio } from "../../../UIProperties/RectUI";

const leaderboards = Workspace.WaitForChild("MapsBoard", 10) as Folder;
const mapsBoard = leaderboards.WaitForChild("Maps", 10) as Part;

interface UIProps {
	badgeInfo: BadgeInfo;
	isOwned: boolean;
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
				Size={new UDim2(0, 100, 0, 100)}
				Position={new UDim2(0, 0, 0, 0)}
			>
				<imagelabel {...RectBG} ImageColor3={Color3.fromRGB(65, 66, 68)}>
					<textlabel
						{...RectText}
						Text={this.props.badgeInfo.Name}
						Position={new UDim2(0.5, 0, 0.05, 0)}
						Size={new UDim2(0.9, 0, 0.3, 0)}
						AnchorPoint={new Vector2(0.5, 0.05)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={"GothamSemibold"}
						TextStrokeTransparency={0.8}
					></textlabel>
					<imagelabel
						{...RectContainer}
						Key={"Badge"}
						Size={new UDim2(0, 45, 0, 45)}
						Position={new UDim2(0.5, 0, 0.9, 0)}
						AnchorPoint={new Vector2(0.5, 0.9)}
						Image={`rbxassetid://${this.props.badgeInfo.IconImageId}`}
						ImageTransparency={this.props.isOwned ? 0 : 0.8}
					></imagelabel>
				</imagelabel>
			</frame>
		);
	}
}

export default Main;
