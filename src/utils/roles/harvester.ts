export class Harvester {
  private creep: Creep
  private storage: StructureSpawn | StructureExtension
  private pos: RoomPosition
  private nearestSource: Source | null

  public constructor(creep: Creep, storage: StructureSpawn | StructureExtension, sources: Source | null, pos: RoomPosition) {
    this.creep = creep;
    this.storage = storage
    this.nearestSource = sources
    this.pos = pos
  }

  private moveToSource(): ERR_NOT_IN_RANGE | OK {
    if (!this.creep.pos.isEqualTo(this.pos)) {
      this.creep.moveTo(this.pos, { visualizePathStyle: { stroke: "#ffaa00" } })
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
    this.creep.moveTo(this.storage, { visualizePathStyle: { stroke: "#ffffff" } })
  }

  private transfer(target: Structure<any>, resource: ResourceConstant) {
    this.creep.transfer(target, resource)
  }

  private shouldTransfer(): boolean {
    return this.creep.store.getFreeCapacity() === 0
  }

  public run(): void {
    if (this.moveToSource() === OK) {
      this.harvestSource()
    }

    if (this.shouldTransfer()) {
      this.moveToStorage()
      this.transfer(this.storage, "energy")
    }
  }
}
