import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { RectContainer } from "client/UIProperties/RectUI";
import RectButton from "../Material/RectButton";
import Object from "@rbxts/object-utils";
import LBEntry from "./LBEntry";
import { ODSState } from "client/Rodux/Reducers/ODSReducer";

interface UIProps {
	GlobalData: (string | number)[][][];
	MonthlyData: (string | number)[][][];
}

interface UIState {
	pageNumber: number;
	category: string;
}

class WinsLB extends Roact.Component<UIProps, UIState> {
	constructor(props: UIProps) {
		super(props);
	}

	state = {
		pageNumber: 1,
		category: "Global",
	};

	render() {
		const entries = this.props[`${this.state.category}Data` as keyof typeof this.props] as (string | number)[][][];

		return (
			<frame
				Size={new UDim2(1, 0, 1, 0)}
				AnchorPoint={new Vector2(0, 0)}
				Position={new UDim2(0, 0, 0, 0)}
				{...RectContainer}
			>
				<frame
					{...RectContainer}
					Position={new UDim2(0.5, 0, 0.03, 0)}
					Size={new UDim2(0.9, 0, 0.1, 0)}
					AnchorPoint={new Vector2(0.5, 0)}
				>
					<textlabel
						TextScaled={true}
						Position={new UDim2(0.14, 0, 0.01, 0)}
						AnchorPoint={new Vector2(0, 0)}
						Size={new UDim2(0.25, 0, 1, 0)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={"GothamBold"}
						Text={"Top"}
						ZIndex={2}
						TextXAlignment={"Right"}
						TextYAlignment={"Center"}
						BackgroundTransparency={1}
					></textlabel>
					<textlabel
						TextScaled={true}
						Position={new UDim2(0.42, 0, 0.01, 0)}
						AnchorPoint={new Vector2(0, 0)}
						Size={new UDim2(0.5, 0, 1, 0)}
						TextColor3={Color3.fromRGB(88, 160, 198)}
						Font={"GothamBold"}
						Text={`12 Wins`}
						ZIndex={2}
						TextXAlignment={"Left"}
						TextYAlignment={"Center"}
						BackgroundTransparency={1}
					></textlabel>
				</frame>
				<textlabel
					TextScaled={true}
					Position={new UDim2(0.5, 0, 0.24, 0)}
					AnchorPoint={new Vector2(0, 0)}
					Size={new UDim2(0.4, 0, 0.075, 0)}
					ZIndex={3}
					Font={"GothamSemibold"}
					TextXAlignment={"Right"}
					TextYAlignment={"Center"}
					Text={"Wins"}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				></textlabel>
				<textlabel
					TextScaled={true}
					Position={new UDim2(0.1, 0, 0.24, 0)}
					AnchorPoint={new Vector2(0, 0)}
					Size={new UDim2(0.25, 0, 0.075, 0)}
					ZIndex={3}
					Font={"GothamSemibold"}
					TextXAlignment={"Left"}
					TextYAlignment={"Center"}
					Text={"Player"}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				></textlabel>
				<frame
					{...RectContainer}
					AnchorPoint={new Vector2(0, 0)}
					Position={new UDim2(0.1, 0, 0.15, 0)}
					Size={new UDim2(0.8, 0, 0.075, 0)}
					ZIndex={2}
				>
					<uilistlayout
						FillDirection={"Horizontal"}
						HorizontalAlignment={"Center"}
						VerticalAlignment={"Center"}
						Padding={new UDim(0.1, 0)}
					></uilistlayout>
					<RectButton
						ButtonText="Global"
						Position={new UDim2(0, 0, 0, 0)}
						AnchorPoint={new Vector2(0, 0)}
						Size={new UDim2(0.4, 0, 0.9, 0)}
						Callback={() => {
							this.setState({ category: "Global" });
						}}
						UseShadow={false}
					/>
					<RectButton
						ButtonText="Monthly"
						Position={new UDim2(0, 0, 0, 0)}
						AnchorPoint={new Vector2(0, 0)}
						Size={new UDim2(0.4, 0, 0.9, 0)}
						Callback={() => {
							this.setState({ category: "Monthly" });
						}}
						UseShadow={false}
					/>
				</frame>
				<frame
					{...RectContainer}
					AnchorPoint={new Vector2(0.5, 0)}
					Position={new UDim2(0.5, 0, 0.32, 0)}
					Size={new UDim2(0.8, 0, 0.575, 0)}
				>
					{Object.entries(entries[this.state.pageNumber]).map((data, index) => {
						return (
							<LBEntry
								playerId={
									(tonumber(data[1][0] as string) !== undefined && tonumber(data[1][0] as string)) ||
									0
								}
								amount={data[1][1] as number}
								rank={index}
							></LBEntry>
						);
					})}
				</frame>
				<frame
					{...RectContainer}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.91, 0)}
					Size={new UDim2(0.4, 0, 0.075, 0)}
				>
					<textlabel
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						Size={new UDim2(0.25, 0, 1, 0)}
						BackgroundTransparency={1}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={"GothamSemibold"}
						TextXAlignment={"Center"}
						TextYAlignment={"Center"}
						Text={tostring(this.state.pageNumber)}
					></textlabel>
					<frame
						Position={new UDim2(0.1, 0, 0, 0)}
						AnchorPoint={new Vector2(0, 0)}
						Size={new UDim2(0.25, 0, 1, 0)}
						{...RectContainer}
					>
						<RectButton
							ButtonText="<"
							Callback={() => {
								this.setState({ pageNumber: math.max(1, this.state.pageNumber - 1) });
							}}
							Size={new UDim2(1, 0, 1, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							UseShadow={false}
						></RectButton>
					</frame>
					<frame
						Position={new UDim2(0.65, 0, 0, 0)}
						AnchorPoint={new Vector2(0, 0)}
						Size={new UDim2(0.25, 0, 1, 0)}
						{...RectContainer}
					>
						<RectButton
							ButtonText=">"
							Callback={() => {
								this.setState({ pageNumber: math.min(2, this.state.pageNumber + 1) });
							}}
							Size={new UDim2(1, 0, 1, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							UseShadow={false}
						></RectButton>
					</frame>
				</frame>
			</frame>
		);
	}
}

interface storeState {
	fetchODSData: ODSState;
}

export = RoactRodux.connect(function (state: storeState) {
	// Create clusters for the data..
	const globalData = [] as (number | string)[][][];
	let globalDataPage = [] as (number | string)[][];
	state.fetchODSData.globalWinsData.forEach((data, index) => {
		if (index % 6 === 0) {
			globalData.push(globalDataPage);
			globalDataPage = [];
		}
		globalDataPage.push(data);
	});

	if (globalData.size() < 6) {
		globalData.push(globalDataPage);
		globalData.push([]);
	} else if (globalData.size() < 12) {
		globalData.push(globalDataPage);
	}

	const monthlyData = [] as (number | string)[][][];
	let monthlyDataPage = [] as (number | string)[][];
	state.fetchODSData.monthlyWinsData.forEach((data, index) => {
		if (index % 6 === 0) {
			monthlyData.push(monthlyDataPage);
			monthlyDataPage = [];
		}
		monthlyDataPage.push(data);
	});

	if (monthlyData.size() < 6) {
		monthlyData.push(monthlyDataPage);
		monthlyData.push([]);
	} else if (monthlyData.size() < 12) {
		monthlyData.push(monthlyDataPage);
	}
	return {
		GlobalData: globalData,
		MonthlyData: monthlyData,
	};
})(WinsLB);
