import { Deployer } from "utils/roles/deployer"

export class DeployerManager {
  private spawn: StructureSpawn
  private creepIDs: string[]

  public constructor(spawn: StructureSpawn, creepIDs: string[]) {
    this.spawn = spawn
    this.creepIDs = creepIDs
  }

  private assignDeployers() {
    for (const [index, id] of this.creepIDs.entries()) {
      new Deployer(Game.creeps[id], this.spawn, index === 0).run()
    }
    return []
  }

  public manage(): string[] {
    return this.assignDeployers()
  }
}
