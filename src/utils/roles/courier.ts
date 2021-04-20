import { COURIER_COLOR } from "utils/constants";

export class Courier {
  private creep: Creep
  private spawn: StructureSpawn
  private storage: StructureExtension

  public constructor(creep: Creep, spawn: StructureSpawn, storage: StructureExtension) {
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
    this.creep.withdraw(this.storage, 'energy')
  }

  private depositInSpawn() {
    return this.creep.transfer(this.spawn, 'energy')
  }

  private shouldCollect(): boolean {
    return this.creep.store.getFreeCapacity() === this.creep.store.getCapacity()
  }

  public run(): void {
    if (this.shouldCollect()) {
      this.moveToStorage()
      this.withdrawFromStorage()
    } else {
      if (this.depositInSpawn() === ERR_NOT_IN_RANGE) this.moveToSpawn()
    }
  }
}
