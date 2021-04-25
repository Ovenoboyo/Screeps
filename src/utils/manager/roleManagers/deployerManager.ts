import { Deployer } from "utils/roles/deployer"
import { Manager } from "../genericManager"

export class DeployerManager extends Manager {
  private assignDeployers() {

    for (const [index, id] of this.creepIDs.entries()) {
      if (this.spawn.store.energy > Game.creeps[id].store.getFreeCapacity('energy') || Game.creeps[id].store.energy > 0) {
        new Deployer(Game.creeps[id], this.spawn, index === 0).run()
        this.usedCreeps.push(id)
      }
    }
    return this.unusedCreeps
  }

  public manage(): string[] {
    return this.assignDeployers()
  }
}
