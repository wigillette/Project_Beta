import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import DonationsShop from "./DonationsShop";

const shop = Workspace.WaitForChild("DonationsShop", 10) as Folder;
const donationsBoard = shop.WaitForChild("Shop", 10) as Part;

const Main = () => {
	return (
		<surfacegui ResetOnSpawn={false} Adornee={donationsBoard} Face={"Back"} ClipsDescendants={true} Enabled={true}>
			<DonationsShop />
		</surfacegui>
	);
};

export default Main;
