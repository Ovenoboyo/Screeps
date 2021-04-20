import { BUILDER_COLOR } from "utils/constants";

export class Builder {
  private creep: Creep
  private storage: StructureSpawn | StructureExtension
  private constructionSite: ConstructionSite

  public constructor(creep: Creep, storage: StructureSpawn | StructureExtension, constructionSite: ConstructionSite) {
    this.creep = creep;
    this.storage = storage
    this.constructionSite = constructionSite
  }

  private moveToConstruction() {
    this.creep.moveTo(this.constructionSite, { visualizePathStyle: { stroke: BUILDER_COLOR } })
  }

  private build() {
    return this.creep.build(this.constructionSite)
  }

  private moveToStorage() {
    this.creep.moveTo(this.storage, { visualizePathStyle: { stroke: BUILDER_COLOR } })
  }

  private shouldCollect(): boolean {
    return this.creep.store.getFreeCapacity() === this.creep.store.getCapacity()
  }

  private withdrawFromStorage() {
    this.moveToStorage()
    this.creep.withdraw(this.storage, "energy")
  }

  public run(): void {
    if (this.shouldCollect()) {
      this.withdrawFromStorage()
    } else {
      if (this.build() === ERR_NOT_IN_RANGE) {
        this.moveToConstruction()
      }
    }
  }
}
