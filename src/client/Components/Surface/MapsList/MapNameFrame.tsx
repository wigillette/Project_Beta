import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import DynamicViewport from "client/Components/Material/DynamicViewport";
import { darkMaterial } from "client/UIProperties/ColorSchemes";
import { registerListDynamicScrolling } from "client/UIProperties/DynamicScrolling";
import { RectBG, RectContainer, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
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

	getModel() {
		let mapModel: Model | undefined = undefined;
		maps.forEach((map) => {
			if (map.Name === this.props.mapName && !mapModel) {
				mapModel = map as Model;
			}
		});

		return mapModel;
	}

	render() {
		const mapModel = this.getModel();
		return (
			<frame
				{...RectContainer}
				AnchorPoint={new Vector2(0, 0)}
				Size={new UDim2(0, 200, 0, 200)}
				Position={new UDim2(0, 0, 0, 0)}
			>
				<imagelabel {...RectBG} ImageColor3={darkMaterial.cardBG}>
					<textlabel
						{...RectText}
						Text={this.props.mapName}
						Position={new UDim2(0.5, 0, 0.05, 0)}
						Size={new UDim2(0.9, 0, 0.2, 0)}
						AnchorPoint={new Vector2(0.5, 0.05)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={"GothamSemibold"}
						TextStrokeTransparency={0.8}
					></textlabel>
					<DynamicViewport
						Model={mapModel}
						Position={new UDim2(0.5, 0, 0.95, 0)}
						AnchorPoint={new Vector2(0.5, 0.95)}
						Size={new UDim2(0.9, 0, 0.7, 0)}
						rotate={true}
						Animation={undefined}
						ZIndex={10}
					/>
				</imagelabel>
			</frame>
		);
	}
}

export default Main;
