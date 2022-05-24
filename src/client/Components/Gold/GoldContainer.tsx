import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import { MenuAspectRatio, RectBG, RectContainer, RectShadow, RectText, Header, Body } from "client/UIProperties/RectUI";
import { MarketplaceService, PolicyService } from "@rbxts/services";
import ProductItem from "./ProductItem";
import { movingFadeAbsolute } from "client/UIProperties/FrameEffects";
import ObjectUtils from "@rbxts/object-utils";
import { goldState, itemsFormat, productFormat } from "../../Rodux/Reducers/GoldReducer";
import { registerGridDynamicScrolling } from "../../UIProperties/DynamicScrolling";
import RectButton from "../Material/RectButton";

interface UIProps {
	toggle: boolean;
	items: itemsFormat;
	currentTab: string;
	switchTab: (tabName: string) => void;
}

const goldRef = Roact.createRef<Frame>();
let oldFadeIn = true;
class GoldContainer extends Roact.Component<UIProps> {
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
			<frame
				{...RectContainer}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(0.5, 0, 0.6, 0)}
				Ref={goldRef}
				AnchorPoint={new Vector2(0.5, 0.5)}
			>
				<uiaspectratioconstraint {...MenuAspectRatio}></uiaspectratioconstraint>
				<imagelabel {...RectBG} ImageColor3={googleMaterial.outerBG}>
					<frame {...Header}>
						<textlabel
							{...RectText}
							Font={Enum.Font.GothamBold}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Size={new UDim2(0.6, 0, 1, 0)}
							Text={"Developer Products"}
							TextColor3={googleMaterial.bgFont}
						></textlabel>
					</frame>
					<frame
						{...RectContainer}
						Size={new UDim2(0.95, 0, 0.15, 0)}
						Position={new UDim2(0.5, 0, 0.225, 0)}
						AnchorPoint={new Vector2(0.5, 0.225)}
					>
						<uilistlayout
							FillDirection={Enum.FillDirection.Horizontal}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							Padding={new UDim(0.1, 0)}
						></uilistlayout>
						{ObjectUtils.keys(this.props.items).map((item) => {
							return (
								<RectButton
									Size={new UDim2(0.35, 0, 0.95, 0)}
									Position={new UDim2(0, 0, 0, 0)}
									AnchorPoint={new Vector2(0, 0)}
									Callback={() => {
										this.props.switchTab(item);
									}}
									ButtonText={item.upper()}
								/>
							);
						})}
					</frame>
					<frame {...Body} Size={new UDim2(0.95, 0, 0.6, 0)}>
						<scrollingframe
							BackgroundTransparency={1}
							Ref={this.scrollRef}
							Size={new UDim2(0.95, 0, 0.95, 0)}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							BorderSizePixel={0}
						>
							<uigridlayout
								Ref={this.gridRef}
								CellSize={new UDim2(0.45, 0, 0.45, 0)}
								CellPadding={new UDim2(0.05, 0, 0.03, 0)}
								SortOrder={Enum.SortOrder.Name}
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
								VerticalAlignment={Enum.VerticalAlignment.Top}
								FillDirection={Enum.FillDirection.Horizontal}
								FillDirectionMaxCells={2}
							>
								<uiaspectratioconstraint
									AspectRatio={2}
									DominantAxis={"Width"}
									AspectType={"ScaleWithParentSize"}
								></uiaspectratioconstraint>
							</uigridlayout>
							{ObjectUtils.values(
								this.props.items[this.props.currentTab as keyof typeof this.props.items],
							).map((product) => {
								let newProduct = product as productFormat | [number, AssetProductInfo];

								if (!("Name" in newProduct)) {
									newProduct = newProduct as [number, AssetProductInfo];
									return (
										<ProductItem
											title={newProduct[1].Name}
											icon={`rbxassetid://${newProduct[1].IconImageAssetId || "5350867529"}`}
											description={
												(newProduct[1].Description !== undefined &&
													newProduct[1].Description) ||
												""
											}
											productId={newProduct[0]}
											isGamePass={this.props.currentTab === "gamepasses"}
										></ProductItem>
									);
								} else {
									newProduct = newProduct as productFormat;
									return (
										<ProductItem
											title={newProduct.Name}
											icon={`rbxassetid://${newProduct.IconImageAssetId || "5350867529"}`}
											description={
												(newProduct.Description !== undefined && newProduct.Description) || ""
											}
											productId={
												(newProduct.ProductId !== undefined && newProduct.ProductId) || 0
											}
											isGamePass={this.props.currentTab === "gamepasses"}
										></ProductItem>
									);
								}
							})}
						</scrollingframe>
					</frame>
				</imagelabel>
				<imagelabel {...RectShadow} ImageColor3={googleMaterial.outerShadow}></imagelabel>
			</frame>
		);
	}

	protected didMount(): void {
		const grid = this.gridRef.getValue();
		const scroll = this.scrollRef.getValue();
		// Make the scroll frame change size depending on number of items
		if (grid && scroll) {
			const connection = registerGridDynamicScrolling(scroll, grid);
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
	fetchProducts: goldState;
	toggleProducts: goldState;
	switchGoldTab: goldState;
}

export = RoactRodux.connect(
	function (state: storeState) {
		const goldFrame = goldRef.getValue() as Frame;
		if (goldFrame && state.toggleProducts.toggle !== oldFadeIn) {
			oldFadeIn = state.toggleProducts.toggle;
			state.toggleProducts.toggle
				? movingFadeAbsolute(goldFrame, true, new UDim2(0.5, 0, 0.4, 0), true)
				: movingFadeAbsolute(goldFrame, false, new UDim2(0.5, 0, 0.1, 0), true);
		}

		return {
			toggle: state.toggleProducts.toggle,
			items: state.fetchProducts.items,
			currentTab: state.switchGoldTab.currentTab,
		};
	},
	(dispatch) => {
		return {
			switchTab: (tabName: string) => {
				dispatch({
					type: "switchGoldTab",
					payload: { tabName: tabName },
				});
			},
		};
	},
)(GoldContainer);
