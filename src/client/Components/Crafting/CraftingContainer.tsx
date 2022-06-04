import { craftingState } from "../../Rodux/Reducers/CraftingReducer";
import RoactRodux from "@rbxts/roact-rodux";
import Roact from "@rbxts/roact";
import { movingFadeAbsolute } from "../../UIProperties/FrameEffects";
import { KnitClient as Knit } from "@rbxts/knit";
const CraftingService = Knit.GetService("CraftingService");
import {
	RectShadow,
	RectBG,
	RectText,
	RectContainer,
	Header,
	Body,
	CardGridLayout,
	SquareAspectRatio,
	MenuAspectRatio,
} from "client/UIProperties/RectUI";
import { googleMaterial, gradientProperties, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import ObjectUtils from "@rbxts/object-utils";
import { registerGridDynamicScrolling } from "../../UIProperties/DynamicScrolling";
import { RARITY_NAMES, GET_RARITY } from "shared/ShopData";
import { MarketplaceService, ReplicatedStorage, Players } from "@rbxts/services";
import RectButton from "../Material/RectButton";
import { inventoryState } from "client/Rodux/Reducers/InventoryReducer";

interface UIProps {
	currentRarity: string;
	selectedSwords: string[];
	playerInventory: Map<string, Model | Tool | "">;
	toggle: boolean;
	switchRarity: (rarityName: string) => void;
	emptySelectedSwords: () => void;
}

let oldFadeIn = true;
const craftingRef = Roact.createRef<Frame>();
class CraftingContainer extends Roact.Component<UIProps> {
	containerRef;
	gridRef;
	scrollRef;
	connections: RBXScriptConnection[];
	modelsFolder = ReplicatedStorage.WaitForChild("ModelsFolder", 10);

	constructor(props: UIProps) {
		super(props);
		this.containerRef = Roact.createRef<Frame>();
		this.gridRef = Roact.createRef<UIGridLayout>();
		this.scrollRef = Roact.createRef<ScrollingFrame>();
		this.connections = [];
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Size={new UDim2(0.4, 0, 0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Ref={craftingRef}
			>
				<uiaspectratioconstraint {...SquareAspectRatio} AspectRatio={1.25}></uiaspectratioconstraint>
				<frame
					Size={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					Ref={this.containerRef}
					{...RectContainer}
				>
					<imagelabel ImageColor3={googleMaterial.outerBG} {...RectBG}>
						<frame {...Header} Size={new UDim2(1, 0, 0.15, 0)}>
							<imagelabel ImageColor3={googleMaterial.header} {...RectBG}>
								<textlabel
									Text={"Crafting"}
									TextStrokeTransparency={0.8}
									AnchorPoint={new Vector2(0.5, 0.05)}
									Position={new UDim2(0.5, 0, 0.05, 0)}
									Size={new UDim2(0.95, 0, 0.45, 0)}
									TextColor3={googleMaterial.headerFont}
									{...RectText}
									Font={"GothamBold"}
								></textlabel>
								<uigradient {...gradientProperties}></uigradient>
							</imagelabel>
						</frame>
						<frame
							{...RectContainer}
							Size={new UDim2(0.95, 0, 0.125, 0)}
							AnchorPoint={new Vector2(0.5, 0.175)}
							Position={new UDim2(0.5, 0, 0.175, 0)}
						>
							<uilistlayout
								FillDirection={Enum.FillDirection.Horizontal}
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
								VerticalAlignment={Enum.VerticalAlignment.Center}
								Padding={new UDim(0.075, 0)}
								SortOrder={Enum.SortOrder.Name}
							></uilistlayout>
							{RARITY_NAMES.map((rarityName) => {
								return (
									<RectButton
										Position={new UDim2(0, 0, 0, 0)}
										AnchorPoint={new Vector2(0, 0)}
										Size={new UDim2(0.275, 0, 0.95, 0)}
										ButtonText={rarityName.upper()}
										Callback={() => {
											this.props.switchRarity(rarityName);
										}}
									></RectButton>
								);
							})}
						</frame>
						<frame
							{...RectContainer}
							Size={new UDim2(0.95, 0, 0.125, 0)}
							AnchorPoint={new Vector2(0.5, 0.325)}
							Position={new UDim2(0.5, 0, 0.325, 0)}
						>
							<uilistlayout
								FillDirection={Enum.FillDirection.Horizontal}
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
								VerticalAlignment={Enum.VerticalAlignment.Center}
								Padding={new UDim(0.075, 0)}
								SortOrder={Enum.SortOrder.Name}
							></uilistlayout>
							{this.props.selectedSwords.map((swordName) => {
								return <frame></frame>;
							})}
						</frame>
						<frame
							{...Body}
							Size={new UDim2(0.95, 0, 0.55, 0)}
							Position={new UDim2(0.5, 0, 0.7, 0)}
							AnchorPoint={new Vector2(0.5, 0.7)}
						>
							<imagelabel ImageColor3={googleMaterial.innerBG2} {...RectBG}>
								<scrollingframe
									BackgroundTransparency={1}
									Ref={this.scrollRef}
									Size={new UDim2(0.95, 0, 0.95, 0)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									AnchorPoint={new Vector2(0.5, 0.5)}
									BorderSizePixel={0}
								>
									<uigridlayout Ref={this.gridRef} {...CardGridLayout}>
										<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
									</uigridlayout>
									{
										// Display all the cards using the CardInfo prop
										ObjectUtils.keys(this.props.playerInventory)
											.filter((sword) => {
												return GET_RARITY(sword) === this.props.currentRarity;
											})
											.map((Item) => {
												return <frame></frame>;
											})
									}
								</scrollingframe>

								<uigradient {...gradientProperties}></uigradient>
							</imagelabel>
						</frame>
						<RectButton
							Position={new UDim2(0.5, 0, 0.975, 0)}
							AnchorPoint={new Vector2(0.5, 0.975)}
							Size={new UDim2(0.25, 0, 0.2, 0)}
							ButtonText={"Craft Swords"}
							Callback={() => {
								CraftingService.CraftSword(this.props.selectedSwords);
							}}
						></RectButton>
						<uigradient {...whiteGradientProperties}></uigradient>
					</imagelabel>
					<imagelabel ImageColor3={googleMaterial.outerShadow} {...RectShadow}></imagelabel>
				</frame>
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

	protected didUpdate(previousProps: UIProps): void {
		if (this.props.toggle === true && previousProps.toggle !== this.props.toggle) {
			spawn(() => {
				const response = pcall(() => {
					return MarketplaceService.UserOwnsGamePassAsync(Players.LocalPlayer.UserId, 8453352);
				});

				if (response[0]) {
					this.setState({ discount: response[1] });
				}
			});
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
	toggleCrafting: craftingState;
	switchRarity: craftingState;
	emptySelectedSwords: craftingState;
	selectSword: craftingState;
	updateInventory: inventoryState;
}

export = RoactRodux.connect(
	(state: storeState) => {
		const craftingFrame = craftingRef.getValue() as Frame;
		if (craftingFrame && state.toggleCrafting.toggle !== oldFadeIn) {
			oldFadeIn = state.toggleCrafting.toggle;
			// Update the frame's position when the toggle changes
			state.toggleCrafting.toggle
				? movingFadeAbsolute(craftingFrame, true, new UDim2(0.5, 0, 0.4, 0), true)
				: movingFadeAbsolute(craftingFrame, false, new UDim2(0.5, 0, 0.1, 0), true);
		}

		return {
			toggle: state.toggleCrafting.toggle,
			currentRarity: state.switchRarity.currentRarity,
			selectedSwords: state.selectSword.selectedSwords,
			playerInventory: state.updateInventory.inventory.Swords,
		};
	},
	(dispatch) => {
		return {
			switchRarity: (rarityName: string) => {
				dispatch({
					type: "switchRarity",
					payload: { newRarity: rarityName },
				});
			},
		};
	},
)(CraftingContainer);