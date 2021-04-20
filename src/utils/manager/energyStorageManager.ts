export abstract class EnergyStorageManager {
  private static storageUsedMap: { [key: string]: boolean } = {}

  private static findStorage(creep: Creep, capacityCheckCallback: (freeCapacity: number) => boolean): EnergyStorage | undefined {
    const storage = creep.room.find(FIND_MY_STRUCTURES, {
      filter: (structure) => (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN)
    }) as (StructureSpawn | StructureExtension)[]

    storage.sort((a, b) => a.pos.getRangeTo(creep.pos.x, creep.pos.y) - b.pos.getRangeTo(creep.pos.x, creep.pos.y))

    for (const s of storage) {
      if (capacityCheckCallback(s.store.getFreeCapacity('energy'))) {

        if (s.structureType === STRUCTURE_EXTENSION) {
          if (!this.storageUsedMap[s.id]) {
            this.storageUsedMap[s.id] = true
            return s
          }
          continue
        }
        return s
      }
    }
    return undefined
  }

  public static findStorageToDeposit(creep: Creep): EnergyStorage | undefined {
    return this.findStorage(creep, (freeCapacity) => freeCapacity > 0)
  }

  public static findStorageToWithdraw(creep: Creep): EnergyStorage | undefined {
    return this.findStorage(creep, (freeCapacity) => freeCapacity >= creep.store.getCapacity())
  }
}
