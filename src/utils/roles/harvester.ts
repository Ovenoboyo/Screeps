export class Harvester {
  private creep: Creep
  private spawn: StructureSpawn
  private pos: RoomPosition
  private nearestSource: Source | null

  public constructor(creep: Creep, spawn: StructureSpawn, sources: Source | null, pos: RoomPosition) {
    this.creep = creep;
    this.spawn = spawn
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

  private moveToSpawn() {
    this.creep.moveTo(this.spawn, { visualizePathStyle: { stroke: "#ffffff" } })
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
      this.moveToSpawn()
      this.transfer(this.spawn, "energy")
    }
  }
}
