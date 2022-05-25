import { StarterGui } from "@rbxts/services";
import { KnitClient as Knit } from "@rbxts/knit";
import { googleMaterial } from "client/UIProperties/ColorSchemes";
import store from "client/Rodux/Store";
const DatabaseService = Knit.GetService("DatabaseService");

interface SortingFormat {
	GlobalDonations: (string | number)[][];
	MonthlyDonations: (string | number)[][];
	GlobalWins: (string | number)[][];
	MonthlyWins: (string | number)[][];
	GlobalKills: (string | number)[][];
	MonthlyKills: (string | number)[][];
}

const ODSClient = {
	FetchData(data: SortingFormat) {
		store.dispatch({
			type: "fetchODSData",
			payload: {
				globalDonationsData: data.GlobalDonations,
				globalKillData: data.GlobalKills,
				globalWinsData: data.GlobalWins,
				monthlyDonationsData: data.MonthlyDonations,
				monthlyKillData: data.MonthlyKills,
				monthlyWinsData: data.MonthlyWins,
			},
		});
	},
	init() {
		DatabaseService.GetAllSortingDataPromise()
			.then((data) => {
				ODSClient.FetchData(data);
			})
			.catch((err) => {
				print(err);
			});
		print("ODS Service Initialized | Client");
	},
};

export default ODSClient;
