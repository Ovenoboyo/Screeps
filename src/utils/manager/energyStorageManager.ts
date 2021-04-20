
export const storageUsedMap: { [key: string]: { withdrawing: boolean, depositing: boolean } } = {}

export function findStorage(creep: Creep, onlyExtension: boolean, capacityCheckCallback: (freeCapacity: number) => boolean): EnergyStorage | undefined {
  const storage = creep.room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN)
  }) as (StructureSpawn | StructureExtension)[]

  storage.sort((a, b) => a.pos.getRangeTo(creep.pos.x, creep.pos.y) - b.pos.getRangeTo(creep.pos.x, creep.pos.y))

  for (const s of storage) {
    if (capacityCheckCallback(s.store.getFreeCapacity('energy'))) {
      if (onlyExtension) {
        if (s.structureType === STRUCTURE_EXTENSION) {
          return s
        }
      } else {
        return s
      }
    }
  }
  return undefined
}

export function findStorageToDeposit(creep: Creep): EnergyStorage | undefined {
  return findStorage(creep, false, (freeCapacity) => freeCapacity > 0)

}

export function findStorageToWithdraw(creep: Creep, onlyExtension: boolean): EnergyStorage | undefined {
  return findStorage(creep, onlyExtension, (freeCapacity) => freeCapacity === 0)
}
