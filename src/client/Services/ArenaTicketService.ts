import { KnitClient as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Store from "../Rodux/Store";
const TicketService = Knit.GetService("ArenaTicketService");
const TicketClient = {
	TicketsChanged: (ticketAmount: number) => {
		Store.dispatch({
			type: "getTickets",
			payload: { ticketAmount: ticketAmount },
		});
	},
	init: () => {
		const initialTickets = TicketService.GetTickets(Players.LocalPlayer);
		TicketClient.TicketsChanged(initialTickets);
		TicketService.TicketsChanged.Connect((ticketAmount: number) => {
			TicketClient.TicketsChanged(ticketAmount);
		});

		print("Profile Service Initialized | Client");
	},
};

export default TicketClient;
