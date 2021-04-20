
export const storageUsedMap: { [key: string]: { withdrawing: boolean, depositing: boolean } } = {}

export function findStorage(creep: Creep, onlyExtension: boolean, capacityCheckCallback: (freeCapacity: number, totalCapacity: number) => boolean): EnergyStorage | null {
  return creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
    filter: (structure) => ((structure.structureType === STRUCTURE_EXTENSION || (!onlyExtension && structure.structureType === STRUCTURE_SPAWN)) && capacityCheckCallback(structure.store.getFreeCapacity('energy'), structure.store.getCapacity('energy')))
  }) as EnergyStorage | null
}

export function findStorageToDeposit(creep: Creep): EnergyStorage | null {
  return findStorage(creep, false, (freeCapacity) => freeCapacity > 0)

}

export function findStorageToWithdraw(creep: Creep, onlyExtension: boolean): EnergyStorage | null {
  return findStorage(creep, onlyExtension, (freeCapacity, total) => freeCapacity < total)
}
