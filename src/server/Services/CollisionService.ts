import { KnitServer as Knit } from "@rbxts/knit";
import { PhysicsService, Players } from "@rbxts/services";

declare global {
	interface KnitServices {
		CollisionService: typeof CollisionService;
	}
}

const CollisionService = Knit.CreateService({
	Name: "CollisionService",
	previousCollisionGroups: new Map<Instance, number>(),

	setCollisionGroup(object: Instance) {
		if (object.IsA("BasePart")) {
			this.previousCollisionGroups.set(object, object.CollisionGroupId);
			PhysicsService.SetPartCollisionGroup(object, "Players");
		}
	},

	setCollisionGroupRecursive(object: Instance) {
		this.setCollisionGroup(object);
		object.GetChildren().forEach((child) => {
			this.setCollisionGroupRecursive(child);
		});
	},

	resetCollisionGroup(object: Instance) {
		if (object.IsA("BasePart")) {
			const previousCollisionGroupId = this.previousCollisionGroups.get(object);
			if (previousCollisionGroupId !== undefined) {
				const previousCollisionGroupName = PhysicsService.GetCollisionGroupName(previousCollisionGroupId);
				if (previousCollisionGroupName !== undefined) {
					PhysicsService.SetPartCollisionGroup(object, previousCollisionGroupName);
					this.previousCollisionGroups.delete(object);
				}
			}
		}
	},

	KnitInit() {
		PhysicsService.CreateCollisionGroup("Players");
		PhysicsService.CollisionGroupSetCollidable("Players", "Players", false);

		Players.PlayerAdded.Connect((player) => {
			wait(0.5);
			this.setCollisionGroupRecursive(player.Character || player.CharacterAdded.Wait()[0]);
			player.CharacterAdded.Connect((char) => {
				if (player.TeamColor === new BrickColor("White")) {
					this.setCollisionGroupRecursive(char);
					char.DescendantAdded.Connect((descendant) => {
						this.setCollisionGroup(descendant);
					});
					char.DescendantRemoving.Connect((descendant) => {
						this.resetCollisionGroup(descendant);
					});
				}
			});
		});
		print("Collision Service Initialized | Server");
	},
});

export default CollisionService;
