import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import KillsLB from "./KillsLB";

const leaderboards = Workspace.WaitForChild("Leaderboards", 10) as Folder;
const killsBoard = leaderboards.WaitForChild("Kills", 10) as Part;

const Main = () => {
	return (
		<surfacegui ResetOnSpawn={false} Adornee={killsBoard} Face={"Back"} ClipsDescendants={true} Enabled={true}>
			<KillsLB />
		</surfacegui>
	);
};

export default Main;
