import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { registerListDynamicScrolling } from "client/UIProperties/DynamicScrolling";
import { RectContainer, RectText } from "client/UIProperties/RectUI";
import { maps, modeDescriptions, modes } from "shared/GameInfo";
import ModeFrame from "./ModeFrame";

const leaderboards = Workspace.WaitForChild("ModesBoard", 10) as Folder;
const modesBoard = leaderboards.WaitForChild("Modes", 10) as Part;

interface UIProps {}

class Main extends Roact.Component<UIProps> {
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
			<surfacegui ResetOnSpawn={false} Adornee={modesBoard} Face={"Back"} ClipsDescendants={true} Enabled={true}>
				<frame
					{...RectContainer}
					AnchorPoint={new Vector2(0, 0)}
					Size={new UDim2(1, 0, 1, 0)}
					Position={new UDim2(0, 0, 0, 0)}
				>
					<textlabel
						{...RectText}
						Font={"GothamBold"}
						Size={new UDim2(0.9, 0, 0.1, 0)}
						Position={new UDim2(0.5, 0, 0.03, 0)}
						AnchorPoint={new Vector2(0.5, 0.03)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextXAlignment={"Center"}
						TextYAlignment={"Center"}
						TextStrokeTransparency={0.8}
						Text={"MODES"}
					></textlabel>
					<scrollingframe
						Size={new UDim2(0.9, 0, 0.825, 0)}
						Position={new UDim2(0.5, 0, 0.9, 0)}
						AnchorPoint={new Vector2(0.5, 0.9)}
						BackgroundTransparency={1}
						Ref={this.scrollRef}
					>
						<uilistlayout
							Ref={this.gridRef}
							FillDirection={"Vertical"}
							HorizontalAlignment={"Center"}
							VerticalAlignment={"Top"}
							Padding={new UDim(0.015, 0)}
						></uilistlayout>
						{Object.entries(modeDescriptions).map((mode) => {
							return <ModeFrame modeName={mode[0]} modeDescription={mode[1]} />;
						})}
					</scrollingframe>
				</frame>
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

export default Main;
