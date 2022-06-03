import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import Database from "@rbxts/datastore2";
import { Players } from "@rbxts/services";

declare global {
	interface KnitServices {
		ArenaTicketService: typeof ArenaTicketService;
	}
}

const ArenaTicketService = Knit.CreateService({
	Name: "ArenaTicketService",

	ArenaTickets: new Map<Player, number>(),
	TicketProbability: 0.05,
	Client: {
		TicketsChanged: new RemoteSignal<(TicketAmount: number) => void>(),
		GetTickets(client: Player, player: Player) {
			return this.Server.GetTickets(player);
		},
	},

	GetTickets(player: Player) {
		return (this.ArenaTickets.has(player) && this.ArenaTickets.get(player)) || 0;
	},

	UpdateTicketData(client: Player, ticketAmount: number) {
		const TicketStore = Database("ArenaTickets", client);
		TicketStore.Set(ticketAmount);
	},

	RollForTicket(client: Player) {
		const profileService = Knit.GetService("ProfileService");
		const chatService = Knit.GetService("ChatService");
		const profile = profileService.GetProfile(client);
		if (profile.Level >= 15) {
			const ticketChance = math.random();
			if (ticketChance <= this.TicketProbability) {
				const currentArenaTickets = this.ArenaTickets.get(client);
				let newTicketAmount = currentArenaTickets;
				if (currentArenaTickets !== undefined) {
					this.ArenaTickets.set(client, currentArenaTickets + 1);
					newTicketAmount = currentArenaTickets + 1;
				} else {
					this.ArenaTickets.set(client, 1);
					newTicketAmount = 1;
				}
				this.Client.TicketsChanged.Fire(client, newTicketAmount);
				this.UpdateTicketData(client, newTicketAmount);
				chatService.PostFeedback(client, "You have earned an arena ticket!");
			}
		}
	},

	InitData(client: Player, ticketAmount: number) {
		this.ArenaTickets.set(client, ticketAmount);
		this.Client.TicketsChanged.Fire(client, ticketAmount);
	},

	KnitInit() {
		Players.PlayerRemoving.Connect((plr) => {
			this.ArenaTickets.delete(plr);
		});
		print("Arena Tickets Service Initialized | Server");
	},
});

export default ArenaTicketService;
