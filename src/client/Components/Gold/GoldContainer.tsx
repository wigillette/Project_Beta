import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import { MenuAspectRatio, RectBG, RectContainer, RectShadow, RectText, Header, Body } from "client/UIProperties/RectUI";
import { MarketplaceService } from "@rbxts/services";
import ProductItem from "./ProductItem";
import { movingFadeAbsolute } from "client/UIProperties/FrameEffects";
import ObjectUtils from "@rbxts/object-utils";
import { productFormat, goldState } from "../../Rodux/Reducers/GoldReducer";
import { registerGridDynamicScrolling } from "../../UIProperties/DynamicScrolling";

interface UIProps {
	toggle: boolean;
	products: productFormat[];
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
				Size={new UDim2(0.4, 0, 0.4, 0)}
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
					<frame {...Body}>
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
								CellPadding={new UDim2(0.05, 0, 0.05, 0)}
								SortOrder={Enum.SortOrder.Name}
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
								VerticalAlignment={Enum.VerticalAlignment.Center}
								FillDirection={Enum.FillDirection.Horizontal}
								FillDirectionMaxCells={2}
							></uigridlayout>
							{ObjectUtils.values(this.props.products).map((product) => {
								return (
									<ProductItem
										title={product.Name}
										icon={`rbxassetid://${product.IconImageAssetId}`}
										description={product.Description}
									></ProductItem>
								);
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
}

export = RoactRodux.connect(function (state: storeState) {
	const goldFrame = goldRef.getValue() as Frame;
	if (goldFrame && state.toggleProducts.toggle !== oldFadeIn) {
		oldFadeIn = state.toggleProducts.toggle;
		state.toggleProducts.toggle
			? movingFadeAbsolute(goldFrame, true, new UDim2(0.5, 0, 0.4, 0), true)
			: movingFadeAbsolute(goldFrame, false, new UDim2(0.5, 0, 0.1, 0), true);
	}
	return {
		toggle: state.toggleProducts.toggle,
		products: state.fetchProducts.products,
	};
})(GoldContainer);
