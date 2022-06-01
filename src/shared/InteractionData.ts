import { Workspace } from "@rbxts/services";

const interactionsFolder = Workspace.WaitForChild("Interactions");

export const NPCInteractions = [
	{
		Name: "Lobby Architect Shawn",
		Message: "Thank you for playing Swordlink! I hope you enjoy the assets I created!",
		Model: interactionsFolder.WaitForChild("Harbinger") as Model,
		Animation: "rbxassetid://9606255387",
	},
	{
		Name: "Bartender Rick",
		Message: "I am quickly running out of hot cocoa. This game is growing quickly!",
		Model: interactionsFolder.WaitForChild("Bartender") as Model,
		Animation: "rbxassetid://9606255387",
	},
	{
		Name: "Exclusive Guest Starla",
		Message: "I heard that the blacksmith creates duplicates of his most prized swords here.",
		Model: interactionsFolder.WaitForChild("VIPMerchant") as Model,
		Animation: "rbxassetid://9606255387",
	},
	{
		Name: "Moderator Honcho",
		Message: "All this practice is really paying off! Step through here to enter the practice arena!",
		Model: interactionsFolder.WaitForChild("Practice") as Model,
		Animation: "rbxassetid://9606255387",
	},
	{
		Name: "Contestant Ryan",
		Message:
			"There is a rumor that gold resides at the top of this obstacle course. I have not had much luck with climbing up there though.",
		Model: interactionsFolder.WaitForChild("Obby") as Model,
		Animation: "rbxassetid://9606255387",
	},
	{
		Name: "Donor Andrew",
		Message:
			"I just donated all my earnings to Swordlink! I am determined to reach the top of the donations leaderboard!",
		Model: interactionsFolder.WaitForChild("Donor") as Model,
		Animation: "rbxassetid://9606255387",
	},
	{
		Name: "Assistant Sophia",
		Message: "Crafting is currently unavailable. Our development team is working as efficiently as possible!",
		Model: interactionsFolder.WaitForChild("Crafting") as Model,
		Animation: "rbxassetid://9606255387",
	},
	{
		Name: "Assistant Jack",
		Message: "Sorry bud, trading is not available at this time! It is rumored to be released soon!",
		Model: interactionsFolder.WaitForChild("Trading2") as Model,
		Animation: "rbxassetid://9606255387",
	},
	{
		Name: "Trader Kyle",
		Message:
			"I was once a formidable contestant here and accumulated a bucket load of gold from victories. After purchasing a collection of swords from the merchant, I traded them all to receive my presigious Ghosdeeri hat.",
		Model: interactionsFolder.WaitForChild("Trading1") as Model,
		Animation: "rbxassetid://9606255387",
	},
	{
		Name: "Blacksmith John",
		Message: "Greetings! I spend my days crafting the most powerful weapons. Would you like to purchase one?",
		Model: interactionsFolder.WaitForChild("Blacksmith") as Model,
		Animation: "rbxassetid://9606255387",
	},
	{
		Name: "Head Manager Lunations",
		Message:
			"Thank you for playing my game! Feel free to take some gold from the chest next to me! Your reward will increase per every consecutive day you play the game!",
		Model: interactionsFolder.WaitForChild("DailyReward") as Model,
		Animation: "rbxassetid://9606255387",
	},
	{
		Name: "Lounge Bouncer Amir",
		Message:
			"Hold up! Only the most esteemed individuals are allowed inside the Iceberg Lounge. To enter, you must own the VIP gamepass.",
		Model: interactionsFolder.WaitForChild("Iceberg") as Model,
		Animation: "rbxassetid://9606255387",
	},
];
