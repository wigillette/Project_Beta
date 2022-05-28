import { KnitClient } from "@rbxts/knit";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { GroupService, MarketplaceService, Players, Workspace } from "@rbxts/services";
import RectButton from "client/Components/Material/RectButton";
import Textbox from "client/Components/Material/Textbox";
import { advertisementBoardState } from "client/Rodux/Reducers/AdvertisementReducer";
import { darkMaterial, googleMaterial } from "client/UIProperties/ColorSchemes";
import { RectBG, RectContainer, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";

const leaderboards = Workspace.WaitForChild("AdvertisementBoards", 10) as Folder;

interface UIProps {
	allGroupInfo: advertisementBoardState;
	boardKey: number;
	previewGroup: (groupId: number, boardKey: number) => void;
}

const advertisementService = KnitClient.GetService("AdvertisementService");

class Main extends Roact.Component<UIProps> {
	leaderImageRef;
	groupImageRef;
	constructor(props: UIProps) {
		super(props);
		this.leaderImageRef = Roact.createRef<ImageLabel>();
		this.groupImageRef = Roact.createRef<ImageLabel>();
	}

	render() {
		const advertisementBoard = leaderboards.FindFirstChild(`Advertisement${this.props.boardKey}`) as Part;
		return (
			<surfacegui
				ResetOnSpawn={false}
				Adornee={advertisementBoard}
				Face={"Back"}
				ClipsDescendants={true}
				Enabled={true}
			>
				<frame
					{...RectContainer}
					AnchorPoint={new Vector2(0, 0)}
					Size={new UDim2(1, 0, 1, 0)}
					Position={new UDim2(0, 0, 0, 0)}
				>
					<frame
						{...RectContainer}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Size={new UDim2(0.95, 0, 0.975, 0)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
					>
						<imagelabel
							{...RectBG}
							Size={new UDim2(1, 0, 1, 0)}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							ImageColor3={googleMaterial.buttonColor}
						>
							<imagelabel
								{...RectBG}
								Size={new UDim2(0.99, 0, 0.99, 0)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								ImageColor3={darkMaterial.outerBG}
							>
								<frame
									{...RectContainer}
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={new UDim2(0.5, 0, 0.63, 0)}
									Size={new UDim2(0.9, 0, 0.68, 0)}
								>
									<imagelabel {...RectBG} ImageColor3={darkMaterial.innerBG}>
										<imagelabel
											{...RectBG}
											Size={new UDim2(0.3, 0, 0.3, 0)}
											Position={new UDim2(0.265, 0, 0.03, 0)}
											AnchorPoint={new Vector2(0.5, 0)}
											ImageColor3={darkMaterial.cardBG}
										>
											<uiaspectratioconstraint
												{...SquareAspectRatio}
												AspectRatio={1.6}
											></uiaspectratioconstraint>
											<imagelabel
												BackgroundTransparency={1}
												Size={new UDim2(0.8, 0, 0.8, 0)}
												Position={new UDim2(0.5, 0, 0.5, 0)}
												AnchorPoint={new Vector2(0.5, 0.5)}
												Image={`https://www.roblox.com/headshot-thumbnail/image?userId=${
													(this.props.allGroupInfo[
														this.props.boardKey as keyof typeof this.props.allGroupInfo
													].groupInfo.Owner &&
														this.props.allGroupInfo[
															this.props.boardKey as keyof typeof this.props.allGroupInfo
														].groupInfo.Owner.Id) ||
													0
												}&width=420&height=420&format=png`}
												Ref={this.leaderImageRef}
											>
												<uiaspectratioconstraint
													{...SquareAspectRatio}
													AspectRatio={1.6}
												></uiaspectratioconstraint>
											</imagelabel>
										</imagelabel>
										<imagelabel
											{...RectBG}
											BackgroundTransparency={1}
											Size={new UDim2(0.3, 0, 0.1, 0)}
											Position={new UDim2(0.72, 0, 0.03, 0)}
											AnchorPoint={new Vector2(0.5, 0)}
											ImageColor3={darkMaterial.cardBG}
										>
											<uiaspectratioconstraint
												{...SquareAspectRatio}
												AspectRatio={1.6}
											></uiaspectratioconstraint>
											<imagelabel
												Size={new UDim2(0.8, 0, 0.8, 0)}
												Position={new UDim2(0.5, 0, 0.5, 0)}
												AnchorPoint={new Vector2(0.5, 0.5)}
												Ref={this.groupImageRef}
												BackgroundTransparency={1}
												Image={
													this.props.allGroupInfo[
														this.props.boardKey as keyof typeof this.props.allGroupInfo
													].groupInfo.EmblemUrl
												}
											>
												<uiaspectratioconstraint
													{...SquareAspectRatio}
													AspectRatio={1.6}
												></uiaspectratioconstraint>
											</imagelabel>
										</imagelabel>
										<frame
											{...RectContainer}
											Size={new UDim2(0.9, 0, 0.12, 0)}
											AnchorPoint={new Vector2(0.5, 0)}
											Position={new UDim2(0.5, 0, 0.4, 0)}
										>
											<uilistlayout
												FillDirection={Enum.FillDirection.Horizontal}
												Padding={new UDim(0.05)}
												HorizontalAlignment={"Center"}
												VerticalAlignment={"Center"}
											></uilistlayout>
											<imagelabel
												{...RectBG}
												BackgroundTransparency={1}
												Size={new UDim2(0.45, 0, 1, 0)}
												Position={new UDim2(0, 0, 0, 0)}
												AnchorPoint={new Vector2(0.5, 0)}
												ImageColor3={darkMaterial.cardBG}
											>
												<textlabel
													{...RectText}
													AnchorPoint={new Vector2(0.5, 0.5)}
													Position={new UDim2(0.5, 0, 0.5, 0)}
													Size={new UDim2(0.8, 0, 0.8, 0)}
													TextColor3={Color3.fromRGB(255, 255, 255)}
													TextStrokeTransparency={0.8}
													Text={
														(this.props.allGroupInfo[
															this.props.boardKey as keyof typeof this.props.allGroupInfo
														].groupInfo.Owner &&
															this.props.allGroupInfo[
																this.props
																	.boardKey as keyof typeof this.props.allGroupInfo
															].groupInfo.Owner.Name) ||
														"UNDEFINED"
													}
												></textlabel>
											</imagelabel>
											<imagelabel
												{...RectBG}
												BackgroundTransparency={1}
												Size={new UDim2(0.45, 0, 1, 0)}
												Position={new UDim2(0, 0, 0, 0)}
												AnchorPoint={new Vector2(0.5, 0)}
												ImageColor3={darkMaterial.cardBG}
											>
												<textlabel
													{...RectText}
													AnchorPoint={new Vector2(0.5, 0.5)}
													Position={new UDim2(0.5, 0, 0.5, 0)}
													Size={new UDim2(0.8, 0, 0.8, 0)}
													TextColor3={Color3.fromRGB(255, 255, 255)}
													TextStrokeTransparency={0.8}
													Text={
														this.props.allGroupInfo[
															this.props.boardKey as keyof typeof this.props.allGroupInfo
														].groupInfo.Name || "UNDEFINED"
													}
												></textlabel>
											</imagelabel>
										</frame>
										<imagelabel
											{...RectBG}
											BackgroundTransparency={1}
											Size={new UDim2(0.9, 0, 0.42, 0)}
											Position={new UDim2(0.5, 0, 0.55, 0)}
											AnchorPoint={new Vector2(0.5, 0)}
											ImageColor3={darkMaterial.cardBG}
										>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0.5, 0.5)}
												Position={new UDim2(0.5, 0, 0.5, 0)}
												Size={new UDim2(0.9, 0, 0.9, 0)}
												TextColor3={Color3.fromRGB(255, 255, 255)}
												TextStrokeTransparency={0.8}
												Text={
													this.props.allGroupInfo[
														this.props.boardKey as keyof typeof this.props.allGroupInfo
													].groupInfo.Description || "UNDEFINED"
												}
											></textlabel>
										</imagelabel>
									</imagelabel>
								</frame>
								<frame
									{...RectContainer}
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={new UDim2(0.5, 0, 0.16, 0)}
									Size={new UDim2(0.9, 0, 0.225, 0)}
								>
									<imagelabel {...RectBG} ImageColor3={darkMaterial.innerBG}>
										<Textbox
											placeholderText="Enter Group Id.."
											onEnter={(text: string) => {
												// Make server call here
												const groupId = tonumber(text);
												if (this.props.boardKey in this.props.allGroupInfo) {
													const boardEntry =
														this.props.allGroupInfo[
															this.props.boardKey as keyof typeof this.props.allGroupInfo
														];
													if (boardEntry && groupId !== undefined && !boardEntry.isClaimed) {
														this.props.previewGroup(groupId, this.props.boardKey);
													}
												}
											}}
											Size={new UDim2(0.9, 0, 0.35, 0)}
											Position={new UDim2(0.5, 0, 0.05, 0)}
											AnchorPoint={new Vector2(0.5, 0.05)}
											AspectRatio={12}
										/>

										<RectButton
											Position={new UDim2(0.5, 0, 0.8, 0)}
											Size={new UDim2(0.25, 0, 0.2, 0)}
											AnchorPoint={new Vector2(0.5, 0.8)}
											ButtonText={"PURCHASE"}
											Callback={() => {
												// Prompt purchase on the server, pass in board key, update all clients by passing the board key as an argument to the client, update respective variables for the board in the rodux store
												if (this.props.boardKey in this.props.allGroupInfo) {
													const boardEntry =
														this.props.allGroupInfo[
															this.props.boardKey as keyof typeof this.props.allGroupInfo
														];
													if (!boardEntry.isClaimed && boardEntry.groupInfo.Id !== 5255599) {
														advertisementService.PurchaseBoard(
															this.props.boardKey,
															boardEntry.groupInfo.Id,
														);
													}
												}
											}}
										/>
									</imagelabel>
								</frame>
							</imagelabel>
						</imagelabel>
					</frame>
				</frame>
			</surfacegui>
		);
	}
}

interface storeState {
	updateGroupInfo: advertisementBoardState;
}

export = RoactRodux.connect(
	function (state: storeState) {
		return {
			allGroupInfo: state.updateGroupInfo,
		};
	},
	(dispatch) => {
		return {
			previewGroup: (groupId: number, boardKey: number) => {
				dispatch({
					type: "updateGroupInfo",
					payload: {
						groupInfo: GroupService.GetGroupInfoAsync(groupId),
						isClaimed: false,
						boardKey: boardKey,
					},
				});
			},
		};
	},
)(Main);
