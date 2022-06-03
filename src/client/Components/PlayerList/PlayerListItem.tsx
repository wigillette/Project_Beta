import Roact from "@rbxts/roact";
import { RectBG, RectContainer, RectShadow, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import { tweenTransparency } from "client/UIProperties/FrameEffects";
import { CircContainer } from "client/UIProperties/CircularUI";
import { MarketplaceService, TweenService } from "@rbxts/services";

interface UIProps {
	player: Player;
}

interface UIState {
	addPrefix: boolean;
}

class PlayerListItem extends Roact.Component<UIProps, UIState> {
	playerFrameRef;
	textRef;
	constructor(props: UIProps) {
		super(props);
		this.playerFrameRef = Roact.createRef<Frame>();
		this.textRef = Roact.createRef<TextLabel>();
		spawn(() => {
			const response = pcall(() => {
				return MarketplaceService.UserOwnsGamePassAsync(this.props.player.UserId, 8453352);
			});

			if (response[0]) {
				this.setState({ addPrefix: response[1] });
			}
		});
	}

	state = {
		addPrefix: false,
	};

	render() {
		return (
			<frame {...RectContainer} Size={new UDim2(0.9, 0, 0.095, 0)} ZIndex={-1} Ref={this.playerFrameRef}>
				<uiaspectratioconstraint
					AspectType={Enum.AspectType.ScaleWithParentSize}
					AspectRatio={6}
					DominantAxis={Enum.DominantAxis.Width}
				></uiaspectratioconstraint>
				<imagelabel {...RectBG} ImageColor3={googleMaterial.outerBG}>
					<frame
						{...CircContainer}
						Size={new UDim2(0.1, 0, 1, 0)}
						Position={new UDim2(0.05, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.05, 0.5)}
					>
						<uiaspectratioconstraint
							{...SquareAspectRatio}
							DominantAxis={Enum.DominantAxis.Height}
						></uiaspectratioconstraint>
						<imagelabel {...RectBG} ImageColor3={googleMaterial.cardBG}>
							<uigradient {...whiteGradientProperties}></uigradient>
							<imagelabel
								{...CircContainer}
								Size={new UDim2(0.9, 0, 0.9, 0)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Image={`https://www.roblox.com/headshot-thumbnail/image?userId=${
									(this.props.player && this.props.player.UserId) || "0"
								}&width=420&height=420&format=png`}
							></imagelabel>
						</imagelabel>
					</frame>
					<textlabel
						{...RectText}
						Position={new UDim2(0.85, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.85, 0.5)}
						TextColor3={googleMaterial.cardFont}
						Size={new UDim2(0.75, 0, 0.8, 0)}
						Text={`${(this.state.addPrefix && "[VIP] ") || ""}${this.props.player.Name}`}
						Ref={this.textRef}
						Font={Enum.Font.GothamBold}
						TextXAlignment={Enum.TextXAlignment.Right}
						TextYAlignment={Enum.TextYAlignment.Bottom}
					>
						<uitextsizeconstraint MaxTextSize={16} MinTextSize={6}></uitextsizeconstraint>
					</textlabel>

					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel {...RectShadow} ImageColor3={googleMaterial.outerShadow}></imagelabel>
			</frame>
		);
	}

	protected didMount(): void {
		const playerFrame = this.playerFrameRef.getValue();
		if (playerFrame) {
			coroutine.wrap(() => {
				playerFrame.Visible = false;
				tweenTransparency(playerFrame, true, false);
				wait(0.35);
				playerFrame.Visible = true;
				tweenTransparency(playerFrame, true, true);
			})();
		}

		if (this.props.player) {
			this.props.player.GetPropertyChangedSignal("TeamColor").Connect(() => {
				const textLabel = this.textRef.getValue();
				if (textLabel) {
					TweenService.Create(
						textLabel,
						new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{
							TextColor3:
								(this.props.player.TeamColor !== new BrickColor("White") &&
									this.props.player.TeamColor.Color) ||
								googleMaterial.cardFont,
						},
					).Play();
				}
			});
		}
	}
}

export = PlayerListItem;
