import { HARVESTER_COLOR } from "utils/constants";

export class Harvester {
  private creep: Creep
  private storage: EnergyStorage | null
  private pos: RoomPosition
  private nearestSource: Source | null

  public constructor(creep: Creep, storage: EnergyStorage | null, sources: Source | null, pos: RoomPosition) {
    this.creep = creep;
    this.storage = storage
    this.nearestSource = sources
    this.pos = pos
  }

  private moveToSource(): ERR_NOT_IN_RANGE | OK {
    if (!this.creep.pos.isEqualTo(this.pos)) {
      this.creep.moveTo(this.pos, { visualizePathStyle: { stroke: HARVESTER_COLOR } })
      if (!this.creep.pos.isEqualTo(this.pos)) return ERR_NOT_IN_RANGE
    }
    return OK
  }

  private harvestSource(): CreepActionReturnCode | -5 | -6 {
    if (this.nearestSource)
      return this.creep.harvest(this.nearestSource)
    // TODO: Return a sensible error
    return 0
  }

  private moveToStorage() {
    if (this.storage)
      this.creep.moveTo(this.storage, { visualizePathStyle: { stroke: HARVESTER_COLOR } })
  }

  private transfer(target: Structure<any>, resource: ResourceConstant) {
    return this.creep.transfer(target, resource)
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

  public run(): void {
    if (this.shouldTransfer()) {
      if (this.storage)
        if (this.transfer(this.storage, "energy") === ERR_NOT_IN_RANGE)
          this.moveToStorage()
    } else {
      if (this.moveToSource() === OK) {
        this.harvestSource()
      }
    }
  }
}
