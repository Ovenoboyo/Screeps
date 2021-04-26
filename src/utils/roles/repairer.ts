import { REPAIRER_COLOR } from "utils/constants";

export class Repairer {
  private creep: Creep
  private storage: EnergyStorage
  private structure: Structure

  public constructor(creep: Creep, storage: EnergyStorage, constructionSite: Structure) {
    this.creep = creep;
    this.storage = storage
    this.structure = constructionSite
  }

  private moveToCustomStructure() {
    this.creep.moveToCustom(this.structure, { visualizePathStyle: { stroke: REPAIRER_COLOR } })
  }

  private repair() {
    return this.creep.repair(this.structure)
  }

  private moveToCustomStorage() {
    this.creep.moveToCustom(this.storage, { visualizePathStyle: { stroke: REPAIRER_COLOR } })
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
      if (this.repair() === ERR_NOT_IN_RANGE) {
        this.moveToCustomStructure()
      }
    }
  }
}
