import { COURIER_COLOR } from "utils/constants";

export class Courier {
  private creep: Creep
  private spawn: StructureSpawn
  private storage: StructureExtension | undefined

  public constructor(creep: Creep, spawn: StructureSpawn, storage: StructureExtension | undefined) {
    this.creep = creep;
    this.spawn = spawn
    this.storage = storage
  }

  private moveToSpawn() {
    this.creep.moveTo(this.spawn, { visualizePathStyle: { stroke: COURIER_COLOR } })
  }

  private moveToStorage() {
    if (this.storage)
      this.creep.moveTo(this.storage, { visualizePathStyle: { stroke: COURIER_COLOR } })
  }

  private withdrawFromStorage() {
    if (this.storage)
      this.creep.withdraw(this.storage, 'energy')
  }

  private depositInSpawn() {
    return this.creep.transfer(this.spawn, 'energy')
  }

  private shouldCollect(): boolean {
    return this.creep.store.getFreeCapacity() === this.creep.store.getCapacity()
  }

  private isSpawnFull() {
    return (this.spawn.store.getFreeCapacity('energy') === 0)
  }

  public run(): void {
    if (this.shouldCollect()) {
      this.moveToStorage()
      this.withdrawFromStorage()
    } else {
      if (!this.isSpawnFull() && this.depositInSpawn() === ERR_NOT_IN_RANGE) this.moveToSpawn()
    }
  }
}
