import { KnitServer as Knit } from "@rbxts/knit";
import { ServerScriptService } from "@rbxts/services";

Knit.AddServices(ServerScriptService.WaitForChild("TS").WaitForChild("Services"));
Knit.Start();
