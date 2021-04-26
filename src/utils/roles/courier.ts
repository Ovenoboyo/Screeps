import { COURIER_COLOR } from "utils/constants";

export class Courier {
  private creep: Creep
  private spawn: EnergyStorage | StructureTower | null
  private storage: EnergyStorage | null

  public constructor(creep: Creep, spawn: EnergyStorage | StructureTower | null, storage: EnergyStorage | null) {
    this.creep = creep;
    this.spawn = spawn
    this.storage = storage
  }

  private moveToSpawn() {
    if (this.spawn)
      this.creep.moveTo(this.spawn, { visualizePathStyle: { stroke: COURIER_COLOR } })
  }

  private moveToStorage() {
    if (this.storage)
      this.creep.moveTo(this.storage, { visualizePathStyle: { stroke: COURIER_COLOR } })
  }

  private withdrawFromStorage() {
    if (this.storage)
      return this.creep.withdraw(this.storage, 'energy')
    return OK
  }

  private depositInSpawn() {
    if (this.spawn)
      return this.creep.transfer(this.spawn, 'energy')
    return OK
  }

  private shouldTransfer(): boolean {
    if (this.creep.memory.isDepositing) {
      if (this.creep.store.energy === 0) {
        this.creep.memory.isDepositing = false
        return false
      }
      return true
    } else {
      if (this.creep.store.getFreeCapacity() === 0) {
        this.creep.memory.isDepositing = true
        return true
      }
      return false
    }
  }

  private isSpawnFull() {
    if (this.spawn)
      return ((this.spawn as StructureContainer).store.getFreeCapacity('energy') === 0)
    return true
  }

  public run(): void {
    if (this.shouldTransfer()) {
      if (!this.isSpawnFull() && this.depositInSpawn() === ERR_NOT_IN_RANGE) this.moveToSpawn()
    } else {
      if (this.withdrawFromStorage() === ERR_NOT_IN_RANGE) this.moveToStorage()
    }
  }
}
