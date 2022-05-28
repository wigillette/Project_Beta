import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import DonationsLB from "./DonationsLB";

const leaderboards = Workspace.WaitForChild("Leaderboards", 10) as Folder;
const donationsBoard = leaderboards.WaitForChild("Donations", 10) as Part;

const Main = () => {
	return (
		<surfacegui ResetOnSpawn={false} Adornee={donationsBoard} Face={"Back"} ClipsDescendants={true} Enabled={true}>
			<DonationsLB />
		</surfacegui>
	);
};

export default Main;
