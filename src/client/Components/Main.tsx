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

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<Profile />
			<Shop />
			<Inventory />
			<Gold />
			<GoldContainer />
			<Twitter />
			<Settings />
			<DailyReward />
			<MatchPanel />
			<BettingContainer />
			<IntroScreen />
			<MatchResults />
		</screengui>
	);
};

export default Main;
