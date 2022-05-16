import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Body, Header, MenuAspectRatio, RectBG, RectContainer, RectShadow, RectText } from "client/UIProperties/RectUI";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import { movingFadeAbsolute } from "../UIProperties/FrameEffects";
import DailyRewardItem from "./DailyRewardItem";
import RectButton from "./Material/RectButton";
import { Players } from "@rbxts/services";
import { dailyRewardState } from "../Rodux/Reducers/DailyRewardReducer";
import DailyRewardService from "../Services/DailyRewardService";
import { REWARD_VALUES } from "../../shared/DailyRewardInfo";
import ObjectUtils from "@rbxts/object-utils";

interface UIProps {
	toggle: boolean;
	currentStreak: number;
	timeAmount: number;
}

interface UIState {
	TimeRemaining: string;
	TimeAmount: number;
}

const dailyRewardRef = Roact.createRef<Frame>();
class DailyReward extends Roact.Component<UIProps, UIState> {
	timeLeftRef;
	streakRef;
	constructor(props: UIProps) {
		super(props);
		this.timeLeftRef = Roact.createRef<TextLabel>();
		this.streakRef = Roact.createRef<TextLabel>();
	}

	state = {
		TimeRemaining: "00:00:00",
		TimeAmount: 0,
	};

	render() {
		return (
			<frame
				{...RectContainer}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={new UDim2(0.5, 0, 0.6, 0)}
				Ref={dailyRewardRef}
			>
				<uiaspectratioconstraint {...MenuAspectRatio}></uiaspectratioconstraint>
				<imagelabel {...RectBG} ImageColor3={googleMaterial.outerBG}>
					<frame {...Header} ZIndex={3}>
						<textlabel
							{...RectText}
							Font={Enum.Font.GothamBold}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Size={new UDim2(0.8, 0, 1, 0)}
							Text={"Daily Reward"}
							TextColor3={googleMaterial.bgFont}
						></textlabel>
					</frame>

					<frame {...Body}>
						<uilistlayout
							FillDirection={Enum.FillDirection.Vertical}
							Padding={new UDim(0.1, 0)}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
						></uilistlayout>
						<frame
							{...RectContainer}
							Size={new UDim2(1, 0, 0.5, 0)}
							Position={new UDim2(0.5, 0, 0.05, 0)}
							AnchorPoint={new Vector2(0.5, 0.05)}
						>
							<uilistlayout
								FillDirection={Enum.FillDirection.Horizontal}
								Padding={new UDim(0.03, 0)}
								SortOrder={Enum.SortOrder.Name}
								VerticalAlignment={Enum.VerticalAlignment.Center}
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
							></uilistlayout>
							{ObjectUtils.entries(REWARD_VALUES).map((rewardInfo) => {
								return (
									<DailyRewardItem
										rewardAmount={rewardInfo[1]}
										day={rewardInfo[0]}
										locked={rewardInfo[0] !== 1 && this.props.currentStreak < rewardInfo[0] - 1}
										icon={"rbxassetid://9341850470"}
									/>
								);
							})}
						</frame>
						<frame
							{...RectContainer}
							Size={new UDim2(0.75, 0, 0.45, 0)}
							Position={new UDim2(0.5, 0, 0.95, 0)}
							AnchorPoint={new Vector2(0.5, 0.95)}
						>
							<textlabel
								{...RectText}
								TextColor3={googleMaterial.bgFont}
								Size={new UDim2(0.5, 0, 0.2, 0)}
								Position={new UDim2(0, 0, 0, 0)}
								AnchorPoint={new Vector2(0, 0)}
								Text={`Current Streak:`}
								TextXAlignment={Enum.TextXAlignment.Center}
								Font={Enum.Font.GothamBold}
							></textlabel>
							<textlabel
								{...RectText}
								Ref={this.streakRef}
								TextColor3={googleMaterial.bgFont}
								Size={new UDim2(0.5, 0, 0.2, 0)}
								Position={new UDim2(1, 0, 0, 0)}
								AnchorPoint={new Vector2(1, 0)}
								Text={`${this.props.currentStreak}`}
								TextXAlignment={Enum.TextXAlignment.Center}
							></textlabel>
							<textlabel
								{...RectText}
								TextColor3={googleMaterial.bgFont}
								Size={new UDim2(0.5, 0, 0.2, 0)}
								Position={new UDim2(0, 0, 0.25, 0)}
								AnchorPoint={new Vector2(0, 0.25)}
								Text={`Time Remaining:`}
								TextXAlignment={Enum.TextXAlignment.Center}
								Font={Enum.Font.GothamBold}
							></textlabel>
							<textlabel
								{...RectText}
								Ref={this.timeLeftRef}
								TextColor3={googleMaterial.bgFont}
								Size={new UDim2(0.5, 0, 0.2, 0)}
								Position={new UDim2(1, 0, 0.25, 0)}
								AnchorPoint={new Vector2(1, 0.25)}
								Text={`${this.state.TimeRemaining}`}
								TextXAlignment={Enum.TextXAlignment.Center}
							></textlabel>
							<RectButton
								ButtonText="Claim Reward"
								Position={new UDim2(0.5, 0, 0.95, 0)}
								AnchorPoint={new Vector2(0.5, 0.95)}
								Size={new UDim2(0.35, 0, 0.3, 0)}
								Callback={() => {
									DailyRewardService.ClaimReward();
								}}
							></RectButton>
						</frame>
					</frame>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel {...RectShadow} ImageColor3={googleMaterial.outerShadow}></imagelabel>
			</frame>
		);
	}

	changeToHMS(seconds: number) {
		let minutes = (seconds - (seconds % 60)) / 60;
		seconds -= minutes * 60;
		const hours = (minutes - (minutes % 60)) / 60;
		minutes -= hours * 60;

		const HMSString = string.format("%02i:%02i:%02i", hours, minutes, seconds);

		return HMSString;
	}

	protected didMount(): void {
		coroutine.wrap(() => {
			while (Players.LocalPlayer) {
				if (this.state.TimeAmount > 0) {
					this.setState({ TimeRemaining: this.changeToHMS(this.state.TimeAmount) });
					this.setState({ TimeAmount: this.state.TimeAmount - 1 });
				} else {
					this.state.TimeAmount = this.props.timeAmount;
				}
				wait(1);
			}
		})();
	}
}

interface storeState {
	toggleDailyReward: dailyRewardState;
	updateStreak: dailyRewardState;
}

export = RoactRodux.connect((state: storeState) => {
	const dailyRewardFrame = dailyRewardRef.getValue();

	if (dailyRewardFrame) {
		state.toggleDailyReward.toggle
			? movingFadeAbsolute(dailyRewardFrame, true, new UDim2(0.5, 0, 0.4, 0))
			: movingFadeAbsolute(dailyRewardFrame, false, new UDim2(0.5, 0, 0.1, 0));
	}

	return {
		toggle: state.toggleDailyReward.toggle,
		currentStreak: state.updateStreak.streak,
		timeAmount: state.updateStreak.timeAmount,
	};
})(DailyReward);
