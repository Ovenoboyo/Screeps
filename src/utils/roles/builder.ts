import { BUILDER_COLOR } from "utils/constants";

export class Builder {
  private creep: Creep
  private spawn: StructureSpawn
  private constructionSite: ConstructionSite

  public constructor(creep: Creep, spawn: StructureSpawn, constructionSite: ConstructionSite) {
    this.creep = creep;
    this.spawn = spawn
    this.constructionSite = constructionSite
  }

  private moveToConstruction() {
    this.creep.moveTo(this.constructionSite, { visualizePathStyle: { stroke: BUILDER_COLOR } })
  }

  private build() {
    return this.creep.build(this.constructionSite)
  }

  private moveToSpawn() {
    this.creep.moveTo(this.spawn, { visualizePathStyle: { stroke: BUILDER_COLOR } })
  }

  private shouldCollect(): boolean {
    return this.creep.store.getFreeCapacity() === this.creep.store.getCapacity()
  }

  private withdrawFromSpawn() {
    this.moveToSpawn()
    this.creep.withdraw(this.spawn, "energy")
  }

  public run(): void {
    if (this.shouldCollect()) {
      this.withdrawFromSpawn()
    } else {
      if (this.build() === ERR_NOT_IN_RANGE) {
        this.moveToConstruction()
      }
    }
  }
}
