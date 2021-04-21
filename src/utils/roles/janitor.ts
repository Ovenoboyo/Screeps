import { JANITOR_COLOR } from "utils/constants";

export class Janitor {
  private creep: Creep
  private deposit: EnergyStorage
  private dropped: Resource

  public constructor(creep: Creep, spawn: EnergyStorage, dropped: Resource) {
    this.creep = creep;
    this.deposit = spawn
    this.dropped = dropped
  }

  private moveToDeposit() {
    this.creep.moveTo(this.deposit, { visualizePathStyle: { stroke: JANITOR_COLOR } })
  }

  private moveToDrop() {
    this.creep.moveTo(this.dropped, { visualizePathStyle: { stroke: JANITOR_COLOR } })
  }

  private pickup() {
    return this.creep.pickup(this.dropped)
  }

  private depositInSpawn() {
    return this.creep.transfer(this.deposit, 'energy')
  }

  private shouldStore() {
    return this.creep.store.energy > 0
  }

  public run(): void {
    if (this.pickup() === ERR_NOT_IN_RANGE) {
      this.moveToDrop()
    }

    if (this.shouldStore()) {
      if (this.depositInSpawn() === ERR_NOT_IN_RANGE) {
        this.moveToDeposit()
      }
    }
  }
}
