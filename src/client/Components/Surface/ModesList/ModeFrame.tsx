import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { TweenService, Workspace } from "@rbxts/services";
import { darkMaterial } from "client/UIProperties/ColorSchemes";
import { registerListDynamicScrolling } from "client/UIProperties/DynamicScrolling";
import { RectBG, RectContainer, RectText } from "client/UIProperties/RectUI";
import { maps } from "shared/GameInfo";

const leaderboards = Workspace.WaitForChild("MapsBoard", 10) as Folder;
const mapsBoard = leaderboards.WaitForChild("Maps", 10) as Part;

interface UIProps {
	modeName: string;
	modeDescription: string;
}

class ModeFrame extends Roact.Component<UIProps> {
	nameRef;
	descRef;
	constructor(props: UIProps) {
		super(props);
		this.nameRef = Roact.createRef<TextLabel>();
		this.descRef = Roact.createRef<TextLabel>();
	}

	render() {
		return (
			<frame
				{...RectContainer}
				AnchorPoint={new Vector2(0, 0)}
				Size={new UDim2(1, 0, 0.04, 0)}
				Position={new UDim2(0, 0, 0, 0)}
			>
				<uiaspectratioconstraint
					AspectRatio={10}
					AspectType={"ScaleWithParentSize"}
					DominantAxis="Width"
				></uiaspectratioconstraint>
				<imagelabel
					{...RectBG}
					ImageColor3={darkMaterial.cardBG}
					Event={{
						MouseEnter: (rbx) => {
							const nameLabel = this.nameRef.getValue();
							const descLabel = this.descRef.getValue();
							if (nameLabel && descLabel) {
								const tweenInfo = new TweenInfo(
									0.15,
									Enum.EasingStyle.Quad,
									Enum.EasingDirection.Out,
									0,
									false,
									0,
								);

								TweenService.Create(nameLabel, tweenInfo, { TextTransparency: 1 }).Play();
								TweenService.Create(descLabel, tweenInfo, { TextTransparency: 0 }).Play();
							}
						},
						MouseLeave: (rbx) => {
							const nameLabel = this.nameRef.getValue();
							const descLabel = this.descRef.getValue();
							if (nameLabel && descLabel) {
								const tweenInfo = new TweenInfo(
									0.3,
									Enum.EasingStyle.Quad,
									Enum.EasingDirection.Out,
									0,
									false,
									0,
								);

								TweenService.Create(descLabel, tweenInfo, { TextTransparency: 1 }).Play();
								TweenService.Create(nameLabel, tweenInfo, { TextTransparency: 0 }).Play();
							}
						},
					}}
				>
					<textlabel
						{...RectText}
						Text={this.props.modeName}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						Size={new UDim2(0.9, 0, 0.9, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={"GothamSemibold"}
						TextStrokeTransparency={0.8}
						Ref={this.nameRef}
					></textlabel>
					<textlabel
						{...RectText}
						Text={this.props.modeDescription}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						Size={new UDim2(0.9, 0, 0.9, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={"GothamSemibold"}
						TextStrokeTransparency={0.8}
						TextTransparency={1}
						Ref={this.descRef}
					></textlabel>
				</imagelabel>
			</frame>
		);
	}
}

export default ModeFrame;
