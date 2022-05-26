import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { darkMaterial } from "client/UIProperties/ColorSchemes";
import { registerListDynamicScrolling } from "client/UIProperties/DynamicScrolling";
import { RectBG, RectContainer, RectText } from "client/UIProperties/RectUI";
import { maps } from "shared/GameInfo";

const leaderboards = Workspace.WaitForChild("MapsBoard", 10) as Folder;
const mapsBoard = leaderboards.WaitForChild("Maps", 10) as Part;

interface UIProps {
	mapName: string;
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
				Size={new UDim2(1, 0, 0.025, 0)}
				Position={new UDim2(0, 0, 0, 0)}
			>
				<uiaspectratioconstraint
					AspectRatio={15}
					AspectType={"ScaleWithParentSize"}
					DominantAxis="Width"
				></uiaspectratioconstraint>
				<imagelabel {...RectBG} ImageColor3={darkMaterial.cardBG}>
					<textlabel
						{...RectText}
						Text={this.props.mapName}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						Size={new UDim2(0.9, 0, 0.9, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={"GothamSemibold"}
						TextStrokeTransparency={0.8}
					></textlabel>
				</imagelabel>
			</frame>
		);
	}
}

export default Main;
