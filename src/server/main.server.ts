import { KnitServer as Knit } from "@rbxts/knit";
import { ServerScriptService } from "@rbxts/services";

// Initialize the services
Knit.AddServices(ServerScriptService.WaitForChild("TS").WaitForChild("Services"));
// And start the services!
Knit.Start();
