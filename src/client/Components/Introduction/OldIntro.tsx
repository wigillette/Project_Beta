import Roact from "@rbxts/roact";
import { Workspace, Players, TweenService } from "@rbxts/services";
import IdleClient from "client/Services/IdleService";
import { darkMaterial } from "client/UIProperties/ColorSchemes";
import { tweenTransparency } from "client/UIProperties/FrameEffects";
import { RectContainer, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import { INTRO_CAMERAS, INITIAL_CAMERA, TRANSITION_INFO, BLACKOUT_INFO } from "shared/IntroCameraData";
import RectButton from "../Material/RectButton";
interface UIProps {}

interface UIState {
	isLoading: boolean;
}

class Intro extends Roact.Component<UIProps, UIState> {
	blackoutRef;
	guiRef;
	buttonContainer;

	state = {
		isLoading: true,
	};

	constructor(props: UIProps) {
		super(props);
		this.blackoutRef = Roact.createRef<Frame>();
		this.guiRef = Roact.createRef<ScreenGui>();
		this.buttonContainer = Roact.createRef<Frame>();
	}

	render() {
		return (
			<screengui ResetOnSpawn={false} Ref={this.guiRef}>
				<frame
					{...RectContainer}
					Size={new UDim2(1, 36, 1, 36)}
					Position={new UDim2(0.5, 0, 0, -36)}
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundColor3={darkMaterial.outerBG}
					BackgroundTransparency={1}
					ZIndex={12}
					Key={"Intro"}
				>
					<frame
						{...RectContainer}
						BackgroundColor3={Color3.fromRGB(0, 0, 0)}
						Size={new UDim2(1, 0, 1, 36)}
						Position={new UDim2(0, 0, 0, 0)}
						AnchorPoint={new Vector2(0, 0)}
						Ref={this.blackoutRef}
					></frame>
					<frame
						{...RectContainer}
						Size={new UDim2(0.4, 0, 0.4, 0)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Ref={this.buttonContainer}
					>
						<uiaspectratioconstraint
							AspectRatio={1.5}
							DominantAxis={Enum.DominantAxis.Width}
						></uiaspectratioconstraint>
						<imagelabel
							{...RectContainer}
							Size={new UDim2(0.9, 0, 0.4, 0)}
							Position={new UDim2(0.5, 0, 0, 0)}
							AnchorPoint={new Vector2(0.5, 0)}
							Image={"rbxassetid://4390093661"}
						>
							<uiaspectratioconstraint
								{...SquareAspectRatio}
								DominantAxis={Enum.DominantAxis.Width}
							></uiaspectratioconstraint>
						</imagelabel>
						<frame
							{...RectContainer}
							Size={new UDim2(1, 0, 0.45, 0)}
							Position={new UDim2(0.5, 0, 1, 0)}
							AnchorPoint={new Vector2(0.5, 1)}
						>
							<uilistlayout
								FillDirection={Enum.FillDirection.Horizontal}
								Padding={new UDim(0.05, 0)}
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
								VerticalAlignment={Enum.VerticalAlignment.Center}
							></uilistlayout>
							<frame {...RectContainer} Size={new UDim2(0.45, 0, 1, 0)}>
								<RectButton
									Position={new UDim2(0.5, 0, 0.5, 0)}
									AnchorPoint={new Vector2(0.5, 0.5)}
									Size={new UDim2(1, 0, 1, 0)}
									ButtonText={"PLAY"}
									Callback={() => {
										this.setState({ isLoading: false });
										IdleClient.loadPlayer();
									}}
								/>
							</frame>
						</frame>
					</frame>
				</frame>
			</screengui>
		);
	}

	protected didMount(): void {
		const client = Players.LocalPlayer;
		const playerGui = client.WaitForChild("PlayerGui");
		const Main = playerGui.WaitForChild("Main");
		const camera = Workspace.CurrentCamera;
		const container = this.guiRef.getValue() as ScreenGui;
		const blackoutFrame = this.blackoutRef.getValue() as Frame;
		const buttonContainer = this.buttonContainer.getValue() as Frame;
		let visibleMenus: Frame[] = [];
		if (camera) {
			spawn(() => {
				camera.CameraType = Enum.CameraType.Scriptable;
				camera.CFrame = INITIAL_CAMERA;
				visibleMenus = (Main.GetChildren() as Frame[]).filter((frame: Frame) => frame.Visible);
				visibleMenus.forEach((menu: Frame) => (menu.Visible = false));

				const blur = new Instance("BlurEffect");
				blur.Size = 30;
				blur.Parent = camera;

				let i = 0;

				while (this.state.isLoading) {
					camera.CFrame = INTRO_CAMERAS[i][0];
					const transformation = TweenService.Create(camera, TRANSITION_INFO, {
						CFrame: INTRO_CAMERAS[i][1],
					});
					transformation.Play();

					transformation.Completed.Wait();
					tweenTransparency(blackoutFrame, false, true);
					wait(0.5);
					tweenTransparency(blackoutFrame, false, false);
					i = (i + 1) % INTRO_CAMERAS.size();
				}

				TweenService.Create(blur, BLACKOUT_INFO, { Size: 0 }).Play();
				tweenTransparency(buttonContainer, true, false);
				wait(1);
				blur.Destroy();
				visibleMenus.forEach((menu) => (menu.Visible = true));
				camera.CameraType = Enum.CameraType.Custom;
				container.Enabled = false;
			});
		}
	}
}

export default Intro;
