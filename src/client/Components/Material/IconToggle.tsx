import Roact from "@rbxts/roact";
import { CircContainer } from "client/UIProperties/CircularUI";
import { gradientProperties } from "client/UIProperties/ColorSchemes";
import { playSound, rippleEffect, tweenColor } from "client/UIProperties/ButtonEffects";
import { Players } from "@rbxts/services";
import { RectBG, RectContainer, RectShadow, SquareAspectRatio } from "client/UIProperties/RectUI";
import RoactRodux from "@rbxts/roact-rodux";
import { settingsState } from "client/Rodux/Reducers/SettingsReducer";

interface UIProps {
	ButtonIcon: string;
	EnabledColor: Color3;
	DisabledColor: Color3;
	ButtonColor: Color3;
	HoverColor: Color3;
	ShadowColor: Color3;
	HoverText: string;
	Size: UDim2;
	Position: UDim2;
	AnchorPoint: Vector2;
	onClick: (state: boolean) => void;
	disallowClick?: boolean;
	initialToggle: boolean;
}

interface UIState {
	debounce: boolean;
}

class IconToggle extends Roact.Component<UIProps, UIState> {
	buttonRef;
	frameRef;
	iconRef;

	state = {
		debounce: false,
	};

	constructor(props: UIProps) {
		super(props);
		this.iconRef = Roact.createRef<ImageLabel>();
		this.buttonRef = Roact.createRef<ImageButton>();
		this.frameRef = Roact.createRef<Frame>();
	}

	render() {
		return (
			<frame
				Ref={this.frameRef}
				{...CircContainer}
				Size={this.props.Size}
				Position={this.props.Position}
				AnchorPoint={this.props.AnchorPoint}
			>
				<uiaspectratioconstraint
					{...SquareAspectRatio}
					DominantAxis={Enum.DominantAxis.Height}
				></uiaspectratioconstraint>
				<imagebutton
					ImageColor3={this.props.ButtonColor}
					{...RectBG}
					Ref={this.buttonRef}
					Event={{
						MouseButton1Click: () => {
							if (!this.state.debounce) {
								this.setState({ debounce: true });
								const frame = this.frameRef.getValue();
								const client = Players.LocalPlayer;
								const mouse = client.GetMouse();

								if (frame) {
									//wait(0.5);
									playSound("Click");
									rippleEffect(frame, mouse);
								}
								this.props.onClick(!this.props.initialToggle);
								this.setState({ debounce: false });
							}
						},
						MouseEnter: (rbx) => {
							playSound("Hover");
							tweenColor(rbx, this.props.HoverColor);
							/*
							const frame = this.frameRef.getValue();
							if (frame) {
								tweenRotation(frame, true);
								const hoverElement = Roact.createElement(hoverNotification, {
									text: this.props.HoverText,
									isRotation: true,
								});
								this.hoverNotificationTree = Roact.mount(hoverElement, frame);
							}
							*/
						},
						MouseLeave: (rbx) => {
							tweenColor(rbx, this.props.ButtonColor);
							/*
							const frame = this.frameRef.getValue();
							if (frame) {
								tweenRotation(frame, false);
								if (this.hoverNotificationTree) {
									Roact.unmount(this.hoverNotificationTree);
									this.hoverNotificationTree = undefined;
								}
							}
							*/
						},
					}}
				>
					<uigradient {...gradientProperties}></uigradient>
					<imagelabel
						{...RectContainer}
						Size={new UDim2(0.8, 0, 0.8, 0)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						ImageColor3={this.props.initialToggle ? this.props.EnabledColor : this.props.DisabledColor}
						Image={this.props.ButtonIcon}
						Ref={this.iconRef}
					>
						<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
					</imagelabel>
				</imagebutton>
				<imagelabel ImageColor3={this.props.ShadowColor} {...RectShadow}></imagelabel>
			</frame>
		);
	}

	protected didUpdate(previousProps: UIProps, previousState: UIState): void {
		if (previousProps.initialToggle !== this.props.initialToggle) {
			const icon = this.iconRef.getValue();

			if (icon) {
				tweenColor(icon, this.props.initialToggle ? this.props.EnabledColor : this.props.DisabledColor);
			}
		}
	}
}

interface storeState {
	updateSettings: settingsState;
}

export = RoactRodux.connect(function (state: storeState) {
	return {
		initialToggle: state.updateSettings.settings.Playing,
	};
})(IconToggle);
