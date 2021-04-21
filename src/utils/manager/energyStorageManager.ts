
export const storageUsedMap: { [key: string]: { withdrawing: boolean, depositing: boolean } } = {}

export function findStorage(creep: Creep, avoidSpawn: boolean, capacityCheckCallback: (freeCapacity: number, totalCapacity: number) => boolean): EnergyStorage | null {
  return creep.pos.findClosestByRange<EnergyStorage>(FIND_STRUCTURES, {
    filter: (structure) => ((structure.structureType === STRUCTURE_EXTENSION || (!avoidSpawn && structure.structureType === STRUCTURE_SPAWN) || (structure.structureType === STRUCTURE_CONTAINER)) && capacityCheckCallback((structure as StructureContainer).store.getFreeCapacity('energy'), (structure as StructureContainer).store.getCapacity('energy')))
  })
}

export function findStorageToDeposit(creep: Creep): EnergyStorage | null {
  return findStorage(creep, false, (freeCapacity) => freeCapacity > 0)

}

export function findStorageToWithdraw(creep: Creep, onlyExtension: boolean): EnergyStorage | null {
  return findStorage(creep, onlyExtension, (freeCapacity, total) => freeCapacity < total)
}
