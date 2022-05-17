import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Body, Header, MenuAspectRatio, RectBG, RectContainer, RectShadow, RectText } from "client/UIProperties/RectUI";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import MatchItem from "./MatchItem";
import { Players } from "@rbxts/services";
import { matchState } from "client/Rodux/Reducers/MatchReducer";

interface UIProps {
	initialTime: number;
	modeName: string;
	mapName: string;
	aliveCounter: number;
}

interface UIState {
	remainingTime: number;
	timeString: string;
}

class MatchPanel extends Roact.Component<UIProps, UIState> {
	constructor(props: UIProps) {
		super(props);
	}

	state = {
		remainingTime: 0,
		timeString: "00:00",
	};

	render() {
		return (
			<frame
				{...RectContainer}
				Position={new UDim2(0.5, 0, 0, 0)}
				AnchorPoint={new Vector2(0.5, 0)}
				Size={new UDim2(0.2, 0, 0.2, 0)}
				ZIndex={-2}
			>
				<uiaspectratioconstraint {...MenuAspectRatio} AspectRatio={3}></uiaspectratioconstraint>
				<imagelabel {...RectBG} ZIndex={-3} ImageColor3={googleMaterial.outerBG}>
					<frame {...Header} ZIndex={-2}>
						<textlabel
							ZIndex={-2}
							{...RectText}
							Font={Enum.Font.GothamBold}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Size={new UDim2(0.6, 0, 1, 0)}
							Text={"Round Information"}
							TextColor3={googleMaterial.bgFont}
						></textlabel>
					</frame>

					<frame {...Body} ZIndex={-2}>
						<uigridlayout
							CellSize={new UDim2(0.45, 0, 0.45, 0)}
							CellPadding={new UDim2(0.05, 0, 0.05, 0)}
							SortOrder={Enum.SortOrder.Name}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							FillDirection={Enum.FillDirection.Horizontal}
							FillDirectionMaxCells={2}
						></uigridlayout>
						<MatchItem value={this.state.timeString} icon={"rbxassetid://4292577589"}></MatchItem>
						<MatchItem value={this.props.aliveCounter} icon={"rbxassetid://4292588813"}></MatchItem>
						<MatchItem value={this.props.mapName} icon={"rbxassetid://4080942935"}></MatchItem>
						<MatchItem value={this.props.modeName} icon={"rbxassetid://4222968932"}></MatchItem>
					</frame>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel {...RectShadow} ImageColor3={googleMaterial.outerShadow} ZIndex={-4}></imagelabel>
			</frame>
		);
	}

	changeToMS(seconds: number) {
		let minutes = (seconds - (seconds % 60)) / 60;
		seconds -= minutes * 60;
		const hours = (minutes - (minutes % 60)) / 60;
		minutes -= hours * 60;

		const HMSString = string.format("%02i:%02i", hours, minutes, seconds);

		return HMSString;
	}

	protected didMount(): void {
		coroutine.wrap(() => {
			while (Players.LocalPlayer) {
				if (this.state.remainingTime > 0) {
					this.setState({ timeString: this.changeToMS(this.state.remainingTime) });
					this.setState({ remainingTime: this.state.remainingTime - 1 });
				} else {
					this.setState({ remainingTime: this.props.initialTime });
				}
				wait(1);
			}
		})();
	}
}

interface storeState {
	updateMatchInfo: matchState;
}

export = RoactRodux.connect(function (state: storeState) {
	return {
		initialTime: state.updateMatchInfo.initialTime,
		modeName: state.updateMatchInfo.modeName,
		mapName: state.updateMatchInfo.mapName,
		aliveCounter: state.updateMatchInfo.aliveCounter,
	};
})(MatchPanel);
