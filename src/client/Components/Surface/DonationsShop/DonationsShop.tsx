import Roact from "@rbxts/roact";
import { RectBG, RectContainer, RectText } from "client/UIProperties/RectUI";
import Object from "@rbxts/object-utils";
import DonationsShopItem from "./DonationsShopItem";
import { darkMaterial, googleMaterial } from "client/UIProperties/ColorSchemes";
import { donationColors, donationProducts } from "shared/DonationsInfo";

interface UIProps {}

class KillsLB extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
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
						<imagelabel {...RectBG} Size={new UDim2(0.99, 0, 0.99, 0)} ImageColor3={darkMaterial.outerBG}>
							<textlabel
								{...RectText}
								Font={"GothamBold"}
								Position={new UDim2(0.5, 0, 0, 0)}
								AnchorPoint={new Vector2(0.5, 0)}
								Size={new UDim2(0.6, 0, 0.1, 0)}
								TextColor3={Color3.fromRGB(255, 255, 255)}
								TextStrokeTransparency={0.8}
								Text={"Donation Board"}
								TextXAlignment={"Center"}
								TextYAlignment={"Bottom"}
							></textlabel>
							<frame
								{...RectContainer}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Position={new UDim2(0.5, 0, 0.55, 0)}
								Size={new UDim2(0.95, 0, 0.85, 0)}
							>
								<uigridlayout
									FillDirectionMaxCells={2}
									FillDirection={"Horizontal"}
									SortOrder={"Name"}
									StartCorner={"TopLeft"}
									HorizontalAlignment={"Center"}
									VerticalAlignment={"Center"}
									CellPadding={new UDim2(0.05, 0, 0.05, 0.05)}
									CellSize={new UDim2(0.45, 0, 0.2, 0)}
								></uigridlayout>
								{Object.keys(donationProducts).map((donationAmount) => {
									const productId = donationProducts[donationAmount as keyof typeof donationProducts];
									const borderColor = donationColors[donationAmount as keyof typeof donationProducts];
									return (
										<DonationsShopItem
											borderColor={borderColor}
											productId={productId}
											amount={donationAmount}
										/>
									);
								})}
							</frame>
						</imagelabel>
					</imagelabel>
				</frame>
			</frame>
		);
	}
}

export = KillsLB;
