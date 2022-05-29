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
import IntroScreen from "./IntroScreen";
import MatchResults from "./Results/MatchResults";
import VotingContainer from "./Voting/VotingContainer";
import PlayerList from "./PlayerList/PlayerList";

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<IntroScreen />
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
		</screengui>
	);
};

export default Main;
