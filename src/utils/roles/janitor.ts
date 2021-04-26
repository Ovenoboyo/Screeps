import { JANITOR_COLOR } from "utils/constants";

export class Janitor {
  private creep: Creep
  private deposit: EnergyStorage
  private dropped: Tombstone | Resource<'energy'> | Ruin

  public constructor(creep: Creep, spawn: EnergyStorage, dropped: Tombstone | Resource<'energy'> | Ruin) {
    this.creep = creep;
    this.deposit = spawn
    this.dropped = dropped
  }

  private moveToCustomDeposit() {
    this.creep.moveToCustom(this.deposit, { visualizePathStyle: { stroke: JANITOR_COLOR } })
  }

  private moveToCustomDrop() {
    this.creep.moveToCustom(this.dropped, { visualizePathStyle: { stroke: JANITOR_COLOR } })
  }

  private pickup() {
    if (this.dropped instanceof Resource)
      return this.creep.pickup(this.dropped)
    else if (this.dropped instanceof Ruin || this.dropped instanceof Tombstone)
      return this.creep.withdraw(this.dropped, 'energy')
    return OK
  }

  private depositInSpawn() {
    return this.creep.transfer(this.deposit, 'energy')
  }

  private shouldStore() {
    return this.creep.store.energy > 0
  }

  public run(): void {
    if (this.pickup() === ERR_NOT_IN_RANGE) {
      this.moveToCustomDrop()
    }

    if (this.shouldStore()) {
      if (this.depositInSpawn() === ERR_NOT_IN_RANGE) {
        this.moveToCustomDeposit()
      }
    }
  }
}
