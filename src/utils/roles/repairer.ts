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

  private moveToStructure() {
    this.creep.moveTo(this.structure, { visualizePathStyle: { stroke: REPAIRER_COLOR } })
  }

  private repair() {
    return this.creep.repair(this.structure)
  }

  private moveToStorage() {
    this.creep.moveTo(this.storage, { visualizePathStyle: { stroke: REPAIRER_COLOR } })
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
      if (this.repair() === ERR_NOT_IN_RANGE) {
        this.moveToStructure()
      }
    }
  }
}
