import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { GoldService } from "./GoldService";
import { InventoryService } from "./InventoryService";
import { ProfileService } from "./ProfileService";
import SnackbarService from "./SnackbarService";
import { PACK_INFO, RARITY_NAMES, GET_RARITY } from "shared/ShopData";
import Object from "@rbxts/object-utils";

declare global {
	interface KnitServices {
		CraftingService: typeof CraftingService;
	}
}

const CraftingService = Knit.CreateService({
	Name: "CraftingService",

	Client: {
		ResetSelection: new RemoteSignal<() => void>(),
		CraftSword(client: Player, selectedSwords: string[]) {
			this.Server.CraftSword(client, selectedSwords);
		},
	},

	SortRarities() {
		const rarities = {
			Common: [] as string[],
			Uncommon: [] as string[],
			Rare: [] as string[],
			Epic: [] as string[],
			Legendary: [] as string[],
		};
		Object.entries(PACK_INFO).forEach((pack) => {
			pack[1].forEach((swordEntry) => {
				if (swordEntry.Rarity in rarities) {
					rarities[swordEntry.Rarity as keyof typeof rarities].push(swordEntry.Name);
				}
			});
		});

		return rarities;
	},

	CraftSword(client: Player, swords: string[]) {
		/*
        1. Check if player is level 10+
        2. Check if swords is length 5
        3. Check if player owns all swords in swords
        4. Check if swords are all the same rarity
        5. Check if player has sufficient gold to craft
        6. Iterate through packs to aggregate swords of certain rarities
        7. Choose random sword of next tier rarity
        8. Deduct 300 gold
        9. Remove selected swords from inventory
        10. Add random sword to inventory
        */
		const playerProfile = ProfileService.GetProfile(client);
		if (playerProfile) {
			const level = playerProfile.Level;
			if (level >= 10) {
				if (swords.size() === 5) {
					let ownsAllSwords = true;
					const selectionMultiplicities = new Map<string, number>();

					swords.forEach((sword) => {
						let currentMultiplicity = selectionMultiplicities.get(sword);
						if (currentMultiplicity === undefined) {
							currentMultiplicity = 1;
						} else {
							currentMultiplicity += 1;
						}
						selectionMultiplicities.set(sword, currentMultiplicity);
					});

					const ownedSwords = InventoryService.FetchInventory(client).Swords;
					swords.forEach((sword) => {
						let ownedMultiplicity = ownedSwords.get(sword);
						let selectionMultiplicity = selectionMultiplicities.get(sword);
						if (ownedMultiplicity === undefined) {
							ownedMultiplicity = 0;
						}
						if (selectionMultiplicity === undefined) {
							selectionMultiplicity = 0;
						}
						ownsAllSwords = ownsAllSwords && selectionMultiplicity <= ownedMultiplicity;
					});

					if (ownsAllSwords) {
						const rarities: string[] = [];
						swords.forEach((sword) => {
							const rarity = GET_RARITY(sword);
							if (rarity) {
								rarities.push(rarity);
							}
						});
						if (rarities.size() === 5) {
							const equalRarities = rarities.every((val, i, arr) => val === arr[0]);
							if (equalRarities) {
								const gold = GoldService.GetGold(client);
								if (gold >= 300) {
									const allRarities = this.SortRarities();
									const currentRarityIndex = RARITY_NAMES.indexOf(rarities[0]);

									if (currentRarityIndex !== -1) {
										const nextRarityIndex = math.clamp(
											currentRarityIndex + 1,
											0,
											RARITY_NAMES.size() - 1,
										);
										const nextRarity = RARITY_NAMES[nextRarityIndex];
										if (nextRarity in allRarities) {
											const nextTierSwords = allRarities[nextRarity as keyof typeof allRarities];
											const randomSword =
												nextTierSwords[math.floor(math.random() * nextTierSwords.size())];

											swords.forEach((sword) => {
												InventoryService.RemoveFromInventory(client, sword, "Swords", false);
											});

											// Instead of five separate calls to update the inventory on the client, I opted to do a single call
											InventoryService.Client.InventoryChanged.Fire(
												client,
												InventoryService.FetchInventory(client),
											);
											this.Client.ResetSelection.Fire(client);

											InventoryService.AddToInventory(client, randomSword, "Swords");
											GoldService.AddGold(client, -300);
											SnackbarService.PushPlayer(
												client,
												`You have crafted a ${nextRarity} ${randomSword} sword!`,
											);
										} else {
											SnackbarService.PushPlayer(client, "Cannot find next tier rarity!");
										}
									} else {
										SnackbarService.PushPlayer(client, "Selected rarity does not exist!");
									}
								} else {
									SnackbarService.PushPlayer(client, "Insufficient gold to craft!");
								}
							} else {
								SnackbarService.PushPlayer(client, "Selected swords are not of the same rarity!");
							}
						} else {
							SnackbarService.PushPlayer(client, "One or more of the selected swords do not exist!");
						}
					} else {
						SnackbarService.PushPlayer(client, "You do not own all the swords you selected!");
					}
				} else {
					SnackbarService.PushPlayer(client, "Must select five swords to craft!");
				}
			} else {
				SnackbarService.PushPlayer(client, "Insufficient level to craft!");
			}
		}
	},

	KnitInit() {
		print("Crafting Service Initialized | Server");
	},
});

export default CraftingService;
