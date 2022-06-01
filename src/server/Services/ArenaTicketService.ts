import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { GoldService } from "./GoldService";

declare global {
	interface KnitServices {
		ArenaTicketService: typeof ArenaTicketService;
	}
}

const ArenaTicketService = Knit.CreateService({
	Name: "ArenaTicketService",

	ArenaTickets: new Map<Player, number>(),
	TicketProbability: 0.05,

	RollForTicket(client: Player) {
		const profileService = Knit.GetService("ProfileService");
		const chatService = Knit.GetService("ChatService");
		const profile = profileService.GetProfile(client);
		if (profile.Level >= 15) {
			const ticketChance = math.random();
			if (ticketChance <= this.TicketProbability) {
				const currentArenaTickets = this.ArenaTickets.get(client);
				if (currentArenaTickets !== undefined) {
					this.ArenaTickets.set(client, currentArenaTickets + 1);
				} else {
					this.ArenaTickets.set(client, 1);
				}
				chatService.PostFeedback(client, "You have earned an arena ticket!");
			}
		}
	},

	KnitInit() {
		print("Arena Tickets Service Initialized | Server");
	},
});

export default ArenaTicketService;
