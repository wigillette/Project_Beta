import Roact from "@rbxts/roact";
import Shop from "./Shop/Shop";
import Inventory from "./Inventory";
import Gold from "./Gold/Gold";
import Profile from "./Profile";
import Twitter from "./Twitter";
import Settings from "./Settings";
import DailyReward from "./DailyReward/DailyReward";
import MatchPanel from "./MatchPanel/MatchPanel";
import GoldContainer from "./Gold/GoldContainer";
import BettingContainer from "./Betting/BettingContainer";
import NewIntro from "./Introduction/NewIntro";
import MatchResults from "./Results/MatchResults";
import VotingContainer from "./Voting/VotingContainer";
import PlayerList from "./PlayerList/PlayerList";
import SpectateButton from "./Spectate/SpectateButton";
import SpectateContainer from "./Spectate/SpectateContainer";
import ArenaTickets from "./ArenaTickets";
import VIPShop from "./VIPShop/VIPShop";
import CraftingContainer from "./Crafting/CraftingContainer";
import RequestsContainer from "./Trading/RequestsContainer";
import TradeContainer from "./Trading/TradeContainer";
import Ping from "./Ping";
import TopBar from "./TopBar";

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<NewIntro />
			<Profile />
			<Shop />
			<Inventory />
			<Twitter />
			<Settings />
			<DailyReward />
			<MatchPanel />
			<BettingContainer />
			<MatchResults />
			<VotingContainer />
			<PlayerList />
			<Gold />
			<GoldContainer />
			<SpectateButton />
			<SpectateContainer />
			<ArenaTickets />
			<VIPShop />
			<CraftingContainer />
			<RequestsContainer />
			<TradeContainer />
			<Ping />
			<TopBar />
		</screengui>
	);
};

export default Main;
