import { COURIER_COLOR } from "utils/constants";

export class Courier {
  private creep: Creep
  private spawn: EnergyStorage
  private storage: EnergyStorage

  public constructor(creep: Creep, spawn: EnergyStorage, storage: EnergyStorage) {
    this.creep = creep;
    this.spawn = spawn
    this.storage = storage
  }

  private moveToSpawn() {
    this.creep.moveTo(this.spawn, { visualizePathStyle: { stroke: COURIER_COLOR } })
  }

  private moveToStorage() {
    this.creep.moveTo(this.storage, { visualizePathStyle: { stroke: COURIER_COLOR } })
  }

  private withdrawFromStorage() {
    return this.creep.withdraw(this.storage, 'energy')
  }

  private depositInSpawn() {
    return this.creep.transfer(this.spawn, 'energy')
  }

  private shouldCollect(): boolean {
    return this.creep.store.getFreeCapacity() !== 0
  }

  private isSpawnFull() {
    return ((this.spawn as StructureContainer).store.getFreeCapacity('energy') === 0)
  }

  public run(): void {
    if (this.shouldCollect()) {
      if (this.withdrawFromStorage() === ERR_NOT_IN_RANGE) this.moveToStorage()
    } else {
      if (!this.isSpawnFull() && this.depositInSpawn() === ERR_NOT_IN_RANGE) this.moveToSpawn()
    }
  }
}
