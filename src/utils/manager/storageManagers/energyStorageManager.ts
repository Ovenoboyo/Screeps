export const storageUsedMap: { [key: string]: { withdrawing: boolean, depositing: boolean } } = {}

export function findStorage(creep: Creep, avoidExtension: boolean, avoidSpawn: boolean, avoidContainer: boolean, capacityCheckCallback: (freeCapacity: number, totalCapacity: number) => boolean): EnergyStorage | null {
  return creep.pos.findClosestByRange<EnergyStorage>(FIND_STRUCTURES, {
    filter: (structure) => ((
      (!avoidExtension && structure.structureType === STRUCTURE_EXTENSION) ||
      (!avoidSpawn && structure.structureType === STRUCTURE_SPAWN && structure.owner.username === creep.owner.username) ||
      (!avoidContainer && structure.structureType === STRUCTURE_CONTAINER)
    ) &&
      capacityCheckCallback((structure as StructureContainer).store.getFreeCapacity('energy'), (structure as StructureContainer).store.getCapacity('energy')))
  })
}

export function findStorageToDeposit(creep: Creep, avoidExtension: boolean, avoidSpawn: boolean, avoidContainer: boolean): EnergyStorage | null {
  return findStorage(creep, avoidExtension, avoidSpawn, avoidContainer, (freeCapacity) => freeCapacity > 0)

}

export function findStorageToWithdraw(creep: Creep, avoidExtension: boolean, avoidSpawn: boolean, avoidContainer: boolean): EnergyStorage | null {
  return findStorage(creep, avoidExtension, avoidSpawn, avoidContainer, (freeCapacity, total) => freeCapacity < total)
}

export function findDroppedEnergy(creep: Creep): Resource<'energy'> | Tombstone | null {
  return creep.pos.findClosestByRange(FIND_TOMBSTONES, { filter: (tomb) => tomb.store.energy > 0 }) || creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: resource => resource.resourceType === 'energy' && resource.amount > 25 }) as Resource<'energy'> | null
}

export function findRuin(creep: Creep): Ruin {
  return creep.pos.findClosestByRange(FIND_RUINS, { filter: ruin => (ruin.store.energy > 0) }) as Ruin
}

export function findTower(creep: Creep): StructureTower {
  return creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: structure => structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity('energy') >= structure.store.getCapacity('energy') * (3 / 4) }) as StructureTower
}
