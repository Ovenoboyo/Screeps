import { Builder } from "utils/roles/builder"

export class BuilderManager {
  private spawn: StructureSpawn
  private creepIDs: string[]
  private usedCreeps: string[] = []
  private sites: ConstructionSite[]

  public constructor(spawn: StructureSpawn, creepIDs: string[]) {
    this.spawn = spawn
    this.creepIDs = creepIDs
    this.sites = this.spawn.room.find(FIND_CONSTRUCTION_SITES)
  }

  private generateBuilder(id: string) {
    new Builder(Game.creeps[id], this.spawn, this.sites[0]).run()
    this.usedCreeps.push(id)
  }

  private assignBuilders(): string[] {
    if (this.sites.length > 0) {
      for (const id of this.creepIDs) {
        this.generateBuilder(id)
      }
      return this.UnusedCreeps
    }
    return this.creepIDs
  }

  private get UnusedCreeps(): string[] {
    return this.creepIDs.filter(x => !this.usedCreeps.includes(x));
  }

  public manage(): string[] {
    return this.assignBuilders()
  }
}
