import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, TweenService, Workspace, BadgeService } from "@rbxts/services";
import { registerListDynamicScrolling } from "client/UIProperties/DynamicScrolling";
import { RectBG, RectContainer, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import { profileBoardState } from "client/Rodux/Reducers/ProfileBoardReducer";
import { darkMaterial, googleMaterial, mediumGradientProperties } from "client/UIProperties/ColorSchemes";
import ComputeKDR from "shared/ComputeKDR";
import ProfilePlayerFrame from "./ProfilePlayerFrame";
import { FetchBoardData } from "client/Services/ProfileBoardService";
import { tweenColor } from "client/UIProperties/ButtonEffects";
import BadgeItem from "./BadgeItem";
const leaderboards = Workspace.WaitForChild("ProfileBoard", 10) as Folder;
const mapsBoard = leaderboards.WaitForChild("ProfileBoard", 10) as Part;

interface UIProps {
	players: Player[];
	playerViewing: Player;
	playerExp: number;
	playerDeaths: number;
	playerKills: number;
	playerWins: number;
	playerLevel: number;
	playerCoins: number;
	playerExpCap: number;
	playerSessionKills: number;
	playerSessionDeaths: number;
	playerSessionWins: number;
	ownedBadges: number[];
	allBadges: number[];
	switchProfile: (playerInfo: profileBoardState) => void;
	updatePlayers: (players: Player[]) => void;
}

class ProfileBoardContainer extends Roact.Component<UIProps> {
	scrollRef;
	gridRef;
	refreshButtonRef;
	connections: RBXScriptConnection[];
	constructor(props: UIProps) {
		super(props);
		this.scrollRef = Roact.createRef<ScrollingFrame>();
		this.gridRef = Roact.createRef<UIListLayout>();
		this.refreshButtonRef = Roact.createRef<ImageButton>();
		this.connections = [];
	}

	render() {
		return (
			<surfacegui ResetOnSpawn={false} Adornee={mapsBoard} Face={"Back"} ClipsDescendants={true} Enabled={true}>
				<frame
					{...RectContainer}
					AnchorPoint={new Vector2(0, 0)}
					Size={new UDim2(1, 0, 1, 0)}
					Position={new UDim2(0, 0, 0, 0)}
				>
					<frame
						{...RectContainer}
						AnchorPoint={new Vector2(0, 0.5)}
						Position={new UDim2(0.013, 0, 0.5, 0)}
						Size={new UDim2(0.3, 0, 0.975, 0)}
					>
						<imagelabel {...RectBG} ImageColor3={googleMaterial.buttonColor}>
							<uigradient {...mediumGradientProperties}></uigradient>
							<imagelabel
								{...RectBG}
								ImageColor3={darkMaterial.innerBG}
								Size={new UDim2(0.975, 0, 0.99, 0)}
							>
								<textlabel
									{...RectText}
									AnchorPoint={new Vector2(0.5, 0)}
									Position={new UDim2(0.5, 0, 0, 0)}
									Size={new UDim2(0.9, 0, 0.1, 0)}
									Font={"GothamBold"}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextStrokeTransparency={0.8}
									Text={`Players (${Players.GetPlayers().size()})`}
								></textlabel>
								<scrollingframe
									Size={new UDim2(0.9, 0, 0.8, 0)}
									Position={new UDim2(0.5, 0, 0.125, 0)}
									AnchorPoint={new Vector2(0.5, 0)}
									BackgroundTransparency={1}
									Ref={this.scrollRef}
								>
									<uilistlayout
										Ref={this.gridRef}
										FillDirection={"Vertical"}
										HorizontalAlignment={"Center"}
										VerticalAlignment={"Top"}
										Padding={new UDim(0.015, 0)}
									></uilistlayout>
									{this.props.players.map((player) => {
										return <ProfilePlayerFrame player={player} />;
									})}
								</scrollingframe>
							</imagelabel>
						</imagelabel>
					</frame>
					<frame
						{...RectContainer}
						AnchorPoint={new Vector2(0, 0.5)}
						Position={new UDim2(0.325, 0, 0.5, 0)}
						Size={new UDim2(0.66, 0, 0.975, 0)}
					>
						<imagelabel {...RectBG} ImageColor3={googleMaterial.buttonColor}>
							<uigradient {...mediumGradientProperties}></uigradient>
							<imagelabel
								{...RectBG}
								ImageColor3={darkMaterial.innerBG}
								Size={new UDim2(0.975, 0, 0.975, 0)}
							>
								<textlabel
									{...RectText}
									AnchorPoint={new Vector2(0.5, 0)}
									Position={new UDim2(0.33, 0, 0, -5)}
									Size={new UDim2(0.6, 0, 0.1, 0)}
									Font={"GothamBold"}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextStrokeTransparency={0.8}
									Text={`Playercard`}
								></textlabel>
								<imagebutton
									{...RectBG}
									Image={"rbxassetid://4745659516"}
									ImageColor3={googleMaterial.buttonColor}
									Size={new UDim2(0, 70, 0, 70)}
									Position={new UDim2(0.9, 0, 0, 0)}
									AnchorPoint={new Vector2(0.9, 0)}
									Ref={this.refreshButtonRef}
									Event={{
										MouseButton1Click: (rbx) => {
											const refreshButton = this.refreshButtonRef.getValue();
											if (refreshButton) {
												TweenService.Create(
													refreshButton,
													new TweenInfo(
														0.4,
														Enum.EasingStyle.Quad,
														Enum.EasingDirection.Out,
														0,
														false,
														0,
													),
													{ Rotation: refreshButton.Rotation + 360 },
												).Play();
											}

											const userProfile = FetchBoardData(this.props.playerViewing);
											if (userProfile) {
												this.props.switchProfile(userProfile);
											}
										},
										MouseEnter: (rbx) => {
											tweenColor(rbx, googleMaterial.buttonHover);
										},
										MouseLeave: (rbx) => {
											tweenColor(rbx, googleMaterial.buttonColor);
										},
									}}
								>
									<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
								</imagebutton>
								<frame
									{...RectContainer}
									AnchorPoint={new Vector2(0.5, 0)}
									Position={new UDim2(0.5, 0, 0.125, 0)}
									Size={new UDim2(0.95, 0, 0.3, 0)}
								>
									<imagelabel {...RectBG} ImageColor3={darkMaterial.cardBG}>
										<textlabel
											{...RectText}
											AnchorPoint={new Vector2(0.5, 0)}
											Position={new UDim2(0.4, 0, 0.35, 0)}
											Size={new UDim2(0.275, 0, 0.2, 0)}
											Font={"GothamSemibold"}
											TextColor3={Color3.fromRGB(255, 255, 255)}
											TextStrokeTransparency={0.8}
											Text={`Level ${this.props.playerLevel}`}
											TextXAlignment={"Left"}
											TextYAlignment={"Top"}
											ZIndex={4}
										></textlabel>
										<textlabel
											{...RectText}
											AnchorPoint={new Vector2(0, 0.5)}
											Position={new UDim2(0.26, 0, 0.2, 0)}
											Size={new UDim2(0.725, 0, 0.2, 0)}
											Font={"GothamSemibold"}
											TextColor3={Color3.fromRGB(255, 255, 255)}
											TextStrokeTransparency={0.8}
											Text={this.props.playerViewing.Name}
											TextXAlignment={"Left"}
											TextYAlignment={"Top"}
											ZIndex={4}
										></textlabel>
										<frame
											{...RectContainer}
											Position={new UDim2(0.01, 0, 0.5, 0)}
											Size={new UDim2(0.24, 0, 0.8, 0)}
											AnchorPoint={new Vector2(0, 0.5)}
										>
											<imagelabel
												{...RectBG}
												Size={new UDim2(0.95, 0, 0.95, 0)}
												Image={`https://www.roblox.com/headshot-thumbnail/image?userId=${this.props.playerViewing.UserId}&width=420&height=420&format=png`}
											>
												<uiaspectratioconstraint
													{...SquareAspectRatio}
												></uiaspectratioconstraint>
											</imagelabel>
										</frame>
										<frame
											{...RectContainer}
											Size={new UDim2(0.7, 0, 0.25, 0)}
											Position={new UDim2(0.26, 0, 0.6, 0)}
											AnchorPoint={new Vector2(0, 0)}
										>
											<imagelabel {...RectBG} ImageColor3={darkMaterial.outerBG}>
												<imagelabel
													{...RectBG}
													AnchorPoint={new Vector2(0, 0.5)}
													Position={new UDim2(0.01, 0, 0.5, 0)}
													Size={
														new UDim2(
															this.props.playerExp / this.props.playerExpCap,
															0,
															0.8,
															0,
														)
													}
													ImageColor3={googleMaterial.buttonColor}
												></imagelabel>
												<textlabel
													{...RectText}
													AnchorPoint={new Vector2(0.5, 0.5)}
													Position={new UDim2(0.5, 0, 0.5, 0)}
													Size={new UDim2(0.85, 0, 0.8, 0)}
													Font={"GothamSemibold"}
													TextColor3={Color3.fromRGB(255, 255, 255)}
													TextStrokeTransparency={0.8}
													Text={`${this.props.playerExp}/${this.props.playerExpCap}`}
													ZIndex={6}
												></textlabel>
											</imagelabel>
										</frame>
									</imagelabel>
								</frame>

								<frame
									{...RectContainer}
									AnchorPoint={new Vector2(0, 0)}
									Position={new UDim2(0.03, 0, 0.575, 0)}
									Size={new UDim2(0.3, 0, 0.4, 0)}
								>
									<imagelabel
										{...RectBG}
										ImageColor3={darkMaterial.cardBG}
										Size={new UDim2(1, 0, 0.15, 0)}
										Position={new UDim2(0.5, 0, 0, 0)}
										AnchorPoint={new Vector2(0.5, 0)}
									>
										<textlabel
											{...RectText}
											AnchorPoint={new Vector2(0.5, 0.5)}
											Position={new UDim2(0.5, 0, 0.5, 0)}
											Size={new UDim2(0.9, 0, 0.85, 0)}
											Font={"GothamSemibold"}
											TextColor3={Color3.fromRGB(255, 255, 255)}
											TextStrokeTransparency={0.8}
											Text={"ALL TIME"}
										></textlabel>
									</imagelabel>
									<imagelabel
										{...RectBG}
										ImageColor3={darkMaterial.cardBG}
										Size={new UDim2(1, 0, 0.825, 0)}
										AnchorPoint={new Vector2(0.5, 1)}
										Position={new UDim2(0.5, 0, 1, 0)}
									>
										<frame
											{...RectContainer}
											AnchorPoint={new Vector2(0, 0)}
											Position={new UDim2(0.05, 0, 0.35, 0)}
											Size={new UDim2(0.9, 0, 0.225, 0)}
										>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0, 0.5)}
												Position={new UDim2(0, 0, 0.5, 0)}
												Size={new UDim2(0.55, 0, 0.85, 0)}
												Font={"GothamSemibold"}
												TextColor3={Color3.fromRGB(255, 255, 255)}
												TextStrokeTransparency={0.8}
												Text={"DEATHS"}
											></textlabel>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0, 0.5)}
												Position={new UDim2(0.42, 0, 0.5, 0)}
												Size={new UDim2(0.5, 0, 0.85, 0)}
												Font={"Gotham"}
												TextColor3={googleMaterial.buttonColor}
												TextStrokeTransparency={0.8}
												Text={tostring(
													this.props.playerDeaths + this.props.playerSessionDeaths,
												)}
											></textlabel>
										</frame>
										<frame
											{...RectContainer}
											AnchorPoint={new Vector2(0, 0)}
											Position={new UDim2(0.05, 0, 0.05, 0)}
											Size={new UDim2(0.9, 0, 0.225, 0)}
										>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0, 0.5)}
												Position={new UDim2(0, 0, 0.5, 0)}
												Size={new UDim2(0.55, 0, 0.85, 0)}
												Font={"GothamSemibold"}
												TextColor3={Color3.fromRGB(255, 255, 255)}
												TextStrokeTransparency={0.8}
												Text={"KILLS"}
											></textlabel>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0, 0.5)}
												Position={new UDim2(0.42, 0, 0.5, 0)}
												Size={new UDim2(0.5, 0, 0.85, 0)}
												Font={"Gotham"}
												TextColor3={googleMaterial.buttonColor}
												TextStrokeTransparency={0.8}
												Text={tostring(this.props.playerKills + this.props.playerSessionKills)}
											></textlabel>
										</frame>
										<frame
											{...RectContainer}
											AnchorPoint={new Vector2(0, 0)}
											Position={new UDim2(0.05, 0, 0.65, 0)}
											Size={new UDim2(0.9, 0, 0.225, 0)}
										>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0, 0.5)}
												Position={new UDim2(0, 0, 0.5, 0)}
												Size={new UDim2(0.55, 0, 0.85, 0)}
												Font={"GothamSemibold"}
												TextColor3={Color3.fromRGB(255, 255, 255)}
												TextStrokeTransparency={0.8}
												Text={"WINS"}
											></textlabel>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0, 0.5)}
												Position={new UDim2(0.42, 0, 0.5, 0)}
												Size={new UDim2(0.5, 0, 0.85, 0)}
												Font={"Gotham"}
												TextColor3={googleMaterial.buttonColor}
												TextStrokeTransparency={0.8}
												Text={tostring(this.props.playerWins + this.props.playerSessionWins)}
											></textlabel>
										</frame>
									</imagelabel>
								</frame>

								<frame
									{...RectContainer}
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									Size={new UDim2(0.94, 0, 0.1, 0)}
								>
									<imagelabel {...RectBG} ImageColor3={darkMaterial.cardBG}>
										<frame
											{...RectContainer}
											Size={new UDim2(0.25, 0, 0.9, 0)}
											Position={new UDim2(0.1, 0, 0.5, 0)}
											AnchorPoint={new Vector2(0.1, 0.5)}
										>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0.5, 0)}
												Position={new UDim2(0.5, 0, 0, 0)}
												Size={new UDim2(1, 0, 0.45, 0)}
												Font={"GothamSemibold"}
												TextColor3={Color3.fromRGB(255, 255, 255)}
												TextStrokeTransparency={0.8}
												Text={"Arena Tickets"}
											></textlabel>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0.5, 0.9)}
												Position={new UDim2(0.5, 0, 0.9, 0)}
												Size={new UDim2(1, 0, 0.45, 0)}
												Font={"GothamSemibold"}
												TextColor3={googleMaterial.buttonColor}
												TextStrokeTransparency={0.8}
												Text={"0"}
												TextXAlignment={"Center"}
											></textlabel>
										</frame>
										<frame
											{...RectContainer}
											Size={new UDim2(0.25, 0, 0.9, 0)}
											Position={new UDim2(0.5, 0, 0.5, 0)}
											AnchorPoint={new Vector2(0.5, 0.5)}
										>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0.5, 0)}
												Position={new UDim2(0.5, 0, 0, 0)}
												Size={new UDim2(1, 0, 0.45, 0)}
												Font={"GothamSemibold"}
												TextColor3={Color3.fromRGB(255, 255, 255)}
												TextStrokeTransparency={0.8}
												Text={"Coins"}
											></textlabel>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0.5, 0.9)}
												Position={new UDim2(0.5, 0, 0.9, 0)}
												Size={new UDim2(1, 0, 0.45, 0)}
												Font={"GothamSemibold"}
												TextColor3={googleMaterial.buttonColor}
												TextStrokeTransparency={0.8}
												Text={tostring(this.props.playerCoins)}
												TextXAlignment={"Center"}
											></textlabel>
										</frame>
										<frame
											{...RectContainer}
											Size={new UDim2(0.25, 0, 0.9, 0)}
											Position={new UDim2(0.9, 0, 0.5, 0)}
											AnchorPoint={new Vector2(0.9, 0.5)}
										>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0.5, 0)}
												Position={new UDim2(0.5, 0, 0, 0)}
												Size={new UDim2(1, 0, 0.45, 0)}
												Font={"GothamSemibold"}
												TextColor3={Color3.fromRGB(255, 255, 255)}
												TextStrokeTransparency={0.8}
												Text={"KDR"}
											></textlabel>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0.5, 0.9)}
												Position={new UDim2(0.5, 0, 0.9, 0)}
												Size={new UDim2(1, 0, 0.45, 0)}
												Font={"GothamSemibold"}
												TextColor3={googleMaterial.buttonColor}
												TextStrokeTransparency={0.8}
												Text={tostring(
													ComputeKDR(
														this.props.playerKills + this.props.playerSessionKills,
														this.props.playerDeaths + this.props.playerSessionDeaths,
													),
												)}
												TextXAlignment={"Center"}
											></textlabel>
										</frame>
									</imagelabel>
								</frame>

								<frame
									{...RectContainer}
									AnchorPoint={new Vector2(0, 0)}
									Position={new UDim2(0.03, 0, 0, 0)}
									Size={new UDim2(0.6, 0, 0.4, 0)}
									Visible={false}
								>
									<imagelabel {...RectBG} ImageColor3={darkMaterial.cardBG}>
										<scrollingframe
											Size={new UDim2(0.95, 0, 0.95, 0)}
											Position={new UDim2(0.5, 0, 0.5, 0)}
											AnchorPoint={new Vector2(0.5, 0.5)}
											BackgroundTransparency={1}
											BorderSizePixel={0}
										>
											<uigridlayout
												CellSize={new UDim2(0, 100, 0, 100)}
												CellPadding={new UDim2(0, 10, 0, 10)}
												FillDirection={"Horizontal"}
												FillDirectionMaxCells={6}
												HorizontalAlignment={"Center"}
												VerticalAlignment={"Top"}
											></uigridlayout>
											{Object.values(this.props.allBadges).map((badge) => {
												return (
													<BadgeItem
														badgeInfo={BadgeService.GetBadgeInfoAsync(badge)}
														isOwned={this.props.ownedBadges.includes(badge)}
													></BadgeItem>
												);
											})}
										</scrollingframe>
									</imagelabel>
								</frame>
								<frame
									{...RectContainer}
									AnchorPoint={new Vector2(0, 0)}
									Position={new UDim2(0.35, 0, 0.575, 0)}
									Size={new UDim2(0.3, 0, 0.4, 0)}
								>
									<imagelabel
										{...RectBG}
										ImageColor3={darkMaterial.cardBG}
										Size={new UDim2(1, 0, 0.15, 0)}
										Position={new UDim2(0.5, 0, 0, 0)}
										AnchorPoint={new Vector2(0.5, 0)}
									>
										<textlabel
											{...RectText}
											AnchorPoint={new Vector2(0.5, 0.5)}
											Position={new UDim2(0.5, 0, 0.5, 0)}
											Size={new UDim2(0.9, 0, 0.85, 0)}
											Font={"GothamSemibold"}
											TextColor3={Color3.fromRGB(255, 255, 255)}
											TextStrokeTransparency={0.8}
											Text={"SESSION"}
										></textlabel>
									</imagelabel>
									<imagelabel
										{...RectBG}
										ImageColor3={darkMaterial.cardBG}
										Size={new UDim2(1, 0, 0.825, 0)}
										AnchorPoint={new Vector2(0.5, 1)}
										Position={new UDim2(0.5, 0, 1, 0)}
									>
										<frame
											{...RectContainer}
											AnchorPoint={new Vector2(0, 0)}
											Position={new UDim2(0.05, 0, 0.35, 0)}
											Size={new UDim2(0.9, 0, 0.225, 0)}
										>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0, 0.5)}
												Position={new UDim2(0, 0, 0.5, 0)}
												Size={new UDim2(0.55, 0, 0.85, 0)}
												Font={"GothamSemibold"}
												TextColor3={Color3.fromRGB(255, 255, 255)}
												TextStrokeTransparency={0.8}
												Text={"DEATHS"}
											></textlabel>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0.9, 0.5)}
												Position={new UDim2(0.9, 0, 0.5, 0)}
												Size={new UDim2(0.5, 0, 0.85, 0)}
												Font={"Gotham"}
												TextColor3={googleMaterial.buttonColor}
												TextStrokeTransparency={0.8}
												Text={tostring(this.props.playerSessionDeaths)}
											></textlabel>
										</frame>
										<frame
											{...RectContainer}
											AnchorPoint={new Vector2(0, 0)}
											Position={new UDim2(0.05, 0, 0.05, 0)}
											Size={new UDim2(0.9, 0, 0.225, 0)}
										>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0, 0.5)}
												Position={new UDim2(0, 0, 0.5, 0)}
												Size={new UDim2(0.55, 0, 0.85, 0)}
												Font={"GothamSemibold"}
												TextColor3={Color3.fromRGB(255, 255, 255)}
												TextStrokeTransparency={0.8}
												Text={"KILLS"}
											></textlabel>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0.9, 0.5)}
												Position={new UDim2(0.9, 0, 0.5, 0)}
												Size={new UDim2(0.5, 0, 0.85, 0)}
												Font={"Gotham"}
												TextColor3={googleMaterial.buttonColor}
												TextStrokeTransparency={0.8}
												Text={tostring(this.props.playerSessionKills)}
											></textlabel>
										</frame>
										<frame
											{...RectContainer}
											AnchorPoint={new Vector2(0, 0)}
											Position={new UDim2(0.05, 0, 0.65, 0)}
											Size={new UDim2(0.9, 0, 0.225, 0)}
										>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0, 0.5)}
												Position={new UDim2(0, 0, 0.5, 0)}
												Size={new UDim2(0.55, 0, 0.85, 0)}
												Font={"GothamSemibold"}
												TextColor3={Color3.fromRGB(255, 255, 255)}
												TextStrokeTransparency={0.8}
												Text={"WINS"}
											></textlabel>
											<textlabel
												{...RectText}
												AnchorPoint={new Vector2(0.9, 0.5)}
												Position={new UDim2(0.9, 0, 0.5, 0)}
												Size={new UDim2(0.5, 0, 0.85, 0)}
												Font={"Gotham"}
												TextColor3={googleMaterial.buttonColor}
												TextStrokeTransparency={0.8}
												Text={tostring(this.props.playerSessionWins)}
											></textlabel>
										</frame>
									</imagelabel>
								</frame>
							</imagelabel>
						</imagelabel>
					</frame>
				</frame>
			</surfacegui>
		);
	}

	protected didMount(): void {
		const grid = this.gridRef.getValue();
		const scroll = this.scrollRef.getValue();
		// Make the scroll frame change size depending on number of items
		if (grid && scroll) {
			const connection = registerListDynamicScrolling(scroll, grid);
			this.connections.push(connection);
		}

		Players.PlayerAdded.Connect(() => {
			this.props.updatePlayers(Players.GetPlayers());
		});
		Players.PlayerRemoving.Connect(() => {
			this.props.updatePlayers(Players.GetPlayers());
		});
	}

	protected willUnmount(): void {
		// Disconnect the scroll frame listener
		this.connections.forEach((connection) => {
			connection.Disconnect();
		});
		this.connections.clear();
	}
}

interface storeState {
	switchProfile: profileBoardState;
	getPlayers: profileBoardState;
	getBadges: profileBoardState;
}

export = RoactRodux.connect(
	function (state: storeState) {
		return {
			playerViewing: state.switchProfile.playerViewing,
			playerKills: state.switchProfile.playerKills,
			playerDeaths: state.switchProfile.playerDeaths,
			playerWins: state.switchProfile.playerWins,
			playerExp: state.switchProfile.playerExp,
			playerLevel: state.switchProfile.playerLevel,
			playerCoins: state.switchProfile.playerCoins,
			playerExpCap: state.switchProfile.playerExpCap,
			playerSessionKills: state.switchProfile.sessionKills,
			playerSessionDeaths: state.switchProfile.sessionDeaths,
			playerSessionWins: state.switchProfile.sessionWins,
			players: state.getPlayers.players,
			ownedBadges: state.getBadges.ownedBadges,
			allBadges: state.getBadges.allBadges,
		};
	},
	(dispatch) => {
		return {
			switchProfile: (playerInfo: profileBoardState) => {
				dispatch({
					type: "switchProfile",
					payload: {
						playerViewing: playerInfo.playerViewing,
						playerExp: playerInfo.playerExp,
						playerDeaths: playerInfo.playerDeaths,
						playerKills: playerInfo.playerKills,
						playerWins: playerInfo.playerWins,
						playerLevel: playerInfo.playerLevel,
						playerCoins: playerInfo.playerCoins,
						playerExpCap: playerInfo.playerExpCap,
						sessionKills: playerInfo.sessionKills,
						sessionDeaths: playerInfo.sessionDeaths,
						sessionWins: playerInfo.sessionWins,
					},
				});
			},
			updatePlayers: (players: Player[]) => {
				dispatch({
					type: "getPlayers",
					payload: {
						players: players,
					},
				});
			},
		};
	},
)(ProfileBoardContainer);
