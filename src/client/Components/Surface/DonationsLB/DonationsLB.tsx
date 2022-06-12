import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { RectContainer } from "client/UIProperties/RectUI";
import RectButton from "../../Material/RectButton";
import Object from "@rbxts/object-utils";
import LBEntry from "../LBEntry";
import { ODSState } from "client/Rodux/Reducers/ODSReducer";
import { Workspace } from "@rbxts/services";
import ODSClient from "client/Services/ODSService";

interface UIProps {
	GlobalData: (string | number)[][][];
	MonthlyData: (string | number)[][][];
	category: string;
	pageNumber: number;
	switchPage: (pageNumber: number) => void;
	switchCategory: (category: string) => void;
}

const leaderboards = Workspace.WaitForChild("Leaderboards");
const mvpModel = leaderboards.WaitForChild("DonorMVP") as Model;

class DonationsLB extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		const entries = this.props[`${this.props.category}Data` as keyof typeof this.props] as (string | number)[][][];

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
						Text={`12 Donations`}
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
					Text={"Donations"}
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
							this.props.switchCategory("Global");
						}}
						UseShadow={false}
					/>
					<RectButton
						ButtonText="Monthly"
						Position={new UDim2(0, 0, 0, 0)}
						AnchorPoint={new Vector2(0, 0)}
						Size={new UDim2(0.4, 0, 0.9, 0)}
						Callback={() => {
							this.props.switchCategory("Monthly");
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
					<uilistlayout
						Padding={new UDim(0.015, 0)}
						FillDirection={"Vertical"}
						VerticalAlignment={"Top"}
						HorizontalAlignment={"Center"}
					></uilistlayout>
					{Object.entries(entries[this.props.pageNumber]).map((data, index) => {
						return (
							<LBEntry
								playerId={
									(tonumber(data[1][0] as string) !== undefined && tonumber(data[1][0] as string)) ||
									0
								}
								amount={data[1][1] as number}
								rank={index + 1}
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
						Text={tostring(this.props.pageNumber + 1)}
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
								this.props.switchPage(math.max(this.props.pageNumber - 1, 0));
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
								this.props.switchPage(math.min(this.props.pageNumber + 1, 1));
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

	protected didUpdate(previousProps: UIProps, previousState: {}): void {
		if (
			previousProps.category !== this.props.category ||
			previousProps.GlobalData !== this.props.GlobalData ||
			previousProps.MonthlyData !== this.props.MonthlyData
		) {
			const entry = this.props[`${this.props.category}Data` as keyof typeof this.props] as (
				| string
				| number
			)[][][];
			const firstCluster = entry[0]; // Check if there are any entries in the first cluster

			if (firstCluster.size() > 0) {
				const mvpUserId =
					(tonumber(entry[0][0][0] as string) !== undefined && tonumber(entry[0][0][0] as string)) || 0;

				ODSClient.UpdateMVP(mvpModel, mvpUserId);
			}
		}
	}
}

interface storeState {
	fetchODSData: ODSState;
	switchODSPage: ODSState;
	switchODSCategory: ODSState;
}

export = RoactRodux.connect(
	function (state: storeState) {
		// Create clusters for the data..
		const globalData = [] as (number | string)[][][];
		let globalDataPage = [] as (number | string)[][];
		state.fetchODSData.globalDonationsData.forEach((data, index) => {
			if (index !== 0 && index % 6 === 0) {
				globalData.push(globalDataPage);
				globalDataPage = [];
			} else {
				globalDataPage.push(data);
			}
		});

		if (globalData.size() < 6) {
			globalData.push(globalDataPage);
			globalData.push([]);
		} else if (globalData.size() < 12) {
			globalData.push(globalDataPage);
		}

		const monthlyData = [] as (number | string)[][][];
		let monthlyDataPage = [] as (number | string)[][];
		state.fetchODSData.monthlyDonationsData.forEach((data, index) => {
			if (index !== 0 && index % 6 === 0) {
				monthlyData.push(monthlyDataPage);
				monthlyDataPage = [];
			} else {
				monthlyDataPage.push(data);
			}
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
			pageNumber: state.switchODSPage.donationsPageNumber,
			category: state.switchODSCategory.donationsCategory,
		};
	},
	(dispatch) => {
		return {
			switchPage: (pageNumber: number) => {
				dispatch({
					type: "switchODSPage",
					payload: { donationsPageNumber: pageNumber },
				});
			},
			switchCategory: (category: string) => {
				dispatch({
					type: "switchODSCategory",
					payload: { donationsCategory: category },
				});
			},
		};
	},
)(DonationsLB);
