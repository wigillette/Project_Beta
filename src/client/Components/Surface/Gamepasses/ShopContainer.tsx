import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { RectBG, RectContainer, RectText } from "client/UIProperties/RectUI";
import ProductItem from "../../Gold/ProductItem";
import Object from "@rbxts/object-utils";
import { darkMaterial, googleMaterial } from "client/UIProperties/ColorSchemes";
import { Workspace } from "@rbxts/services";
import { goldState, itemsFormat } from "client/Rodux/Reducers/GoldReducer";
import { registerGridDynamicScrolling } from "client/UIProperties/DynamicScrolling";

interface UIProps {
	items: itemsFormat;
}

const gamepassShop = Workspace.WaitForChild("GamepassShop");
const shop = gamepassShop.WaitForChild("Shop") as Part;

class ShopContainer extends Roact.Component<UIProps> {
	scrollRef;
	gridRef;
	connections: RBXScriptConnection[];
	constructor(props: UIProps) {
		super(props);
		this.scrollRef = Roact.createRef<ScrollingFrame>();
		this.gridRef = Roact.createRef<UIGridLayout>();
		this.connections = [];
	}

	render() {
		return (
			<surfacegui ResetOnSpawn={false} Adornee={shop} Face={"Back"} ClipsDescendants={true} Enabled={true}>
				<frame
					Size={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(0, 0)}
					Position={new UDim2(0, 0, 0, 0)}
					{...RectContainer}
				>
					<frame
						{...RectContainer}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						Size={new UDim2(0.95, 0, 0.975, 0)}
					>
						<imagelabel {...RectBG} ImageColor3={googleMaterial.buttonColor}>
							<imagelabel
								{...RectBG}
								Size={new UDim2(0.99, 0, 0.99, 0)}
								ImageColor3={darkMaterial.outerBG}
							>
								<textlabel
									{...RectText}
									Font={"GothamBold"}
									Position={new UDim2(0.5, 0, 0, 0)}
									AnchorPoint={new Vector2(0.5, 0)}
									Size={new UDim2(0.6, 0, 0.1, 0)}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextStrokeTransparency={0.8}
									Text={"GAMEPASSES"}
									TextXAlignment={"Center"}
									TextYAlignment={"Bottom"}
								></textlabel>
								<scrollingframe
									Size={new UDim2(0.9, 0, 0.86, 0)}
									Position={new UDim2(0.5, 0, 0.9, 0)}
									AnchorPoint={new Vector2(0.5, 0.9)}
									CanvasSize={new UDim2(0, 0, 1.5, 0)}
									BackgroundTransparency={1}
									Ref={this.scrollRef}
								>
									<uigridlayout
										FillDirectionMaxCells={2}
										FillDirection={"Horizontal"}
										SortOrder={"Name"}
										StartCorner={"TopLeft"}
										HorizontalAlignment={"Center"}
										VerticalAlignment={"Top"}
										CellPadding={new UDim2(0.05, 0, 0, 10)}
										CellSize={new UDim2(0.45, 0, 0.15, 0)}
									></uigridlayout>
									{Object.values(this.props.items.gamepasses).map((product) => {
										return (
											<ProductItem
												title={product[1].Name}
												icon={`rbxassetid://${product[1].IconImageAssetId || "5350867529"}`}
												description={
													(product[1].Description !== undefined && product[1].Description) ||
													""
												}
												productId={product[0]}
												isGamePass={true}
												darkMaterial={true}
											></ProductItem>
										);
									})}
								</scrollingframe>
							</imagelabel>
						</imagelabel>
					</frame>
				</frame>
			</surfacegui>
		);
	}
}

interface storeState {
	fetchProducts: goldState;
}

export = RoactRodux.connect((state: storeState) => {
	return {
		items: state.fetchProducts.items,
	};
})(ShopContainer);
