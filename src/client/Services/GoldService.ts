import { KnitClient as Knit } from "@rbxts/knit";
import { SoundService } from "@rbxts/services";
import { itemsFormat, productFormat } from "client/Rodux/Reducers/GoldReducer";
import Store from "../Rodux/Store";
const GoldService = Knit.GetService("GoldService");
const CoinDropService = Knit.GetService("CoinDropService");
const GoldClient = {
	GoldChanged: (Gold: number) => {
		Store.dispatch({
			type: "updateGold",
			payload: { Gold: Gold },
		});
	},
	FetchProducts: (items: itemsFormat) => {
		Store.dispatch({
			type: "fetchProducts",
			payload: { items: items },
		});
	},
	init: () => {
		const initialGold = GoldService.GetGold();
		GoldClient.GoldChanged(initialGold);
		GoldService.GoldChanged.Connect(GoldClient.GoldChanged);
		CoinDropService.PlayCoinSound.Connect(() => {
			const coinSound = SoundService.WaitForChild("SFX").FindFirstChild("Coin") as Sound;
			if (coinSound) {
				coinSound.Play();
			}
		});
		GoldService.GetProductsPromise()
			.then((items) => {
				const page = items as itemsFormat;
				GoldClient.FetchProducts(page);
			})
			.catch((err) => {
				print(err);
				print("Failed to load products.");
			});
		print("Gold Service Initialized | Client");
	},
};

export default GoldClient;
