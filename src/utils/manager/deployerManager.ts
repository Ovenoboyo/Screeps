import { Deployer } from "utils/roles/deployer"

export class DeployerManager {
  private spawn: StructureSpawn
  private creepIDs: string[]
  private usedCreeps: string[] = []

  public constructor(spawn: StructureSpawn, creepIDs: string[]) {
    this.spawn = spawn
    this.creepIDs = creepIDs
  }

  private assignDeployers() {

    for (const [index, id] of this.creepIDs.entries()) {
      if (this.spawn.store.energy > Game.creeps[id].store.getFreeCapacity('energy')) {
        new Deployer(Game.creeps[id], this.spawn, index === 0).run()
        this.usedCreeps.push(id)
      }
    }
    return this.UnusedCreeps
  }

  private get UnusedCreeps(): string[] {
    return this.creepIDs.filter(x => !this.usedCreeps.includes(x));
  }

  public manage(): string[] {
    return this.assignDeployers()
  }
}
