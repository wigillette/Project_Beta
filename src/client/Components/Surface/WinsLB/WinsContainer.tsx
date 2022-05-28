import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import WinsLB from "./WinsLB";

const leaderboards = Workspace.WaitForChild("Leaderboards", 10) as Folder;
const winsBoard = leaderboards.WaitForChild("Wins", 10) as Part;

const Main = () => {
	return (
		<surfacegui ResetOnSpawn={false} Adornee={winsBoard} Face={"Back"} ClipsDescendants={true} Enabled={true}>
			<WinsLB />
		</surfacegui>
	);
};

export default Main;
