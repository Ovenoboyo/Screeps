import { BUILDER_COLOR } from "utils/constants";

export class Builder {
  private creep: Creep
  private storage: EnergyStorage
  private constructionSite: ConstructionSite

  public constructor(creep: Creep, storage: EnergyStorage, constructionSite: ConstructionSite) {
    this.creep = creep;
    this.storage = storage
    this.constructionSite = constructionSite
  }

  private moveToCustomConstruction() {
    this.creep.moveToCustom(this.constructionSite, { visualizePathStyle: { stroke: BUILDER_COLOR } })
  }

  private build() {
    return this.creep.build(this.constructionSite)
  }

  private moveToCustomStorage() {
    this.creep.moveToCustom(this.storage, { visualizePathStyle: { stroke: BUILDER_COLOR } })
  }

  private shouldCollect(): boolean {
    return this.creep.store.getFreeCapacity() === this.creep.store.getCapacity()
  }

  private withdrawFromStorage() {
    if (this.creep.withdraw(this.storage, "energy") === ERR_NOT_IN_RANGE)
      this.moveToCustomStorage()
  }

  public run(): void {
    if (this.shouldCollect()) {
      this.withdrawFromStorage()
    } else {
      if (this.build() === ERR_NOT_IN_RANGE) {
        this.moveToCustomConstruction()
      }
    }
  }
}
