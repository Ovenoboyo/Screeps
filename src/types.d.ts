// example declaration file - remove these and add your own custom typings

type Role = 'harvester' | 'deployer' | 'janitor' | 'builder' | 'repairer' | 'courier'

type RoleCountMap = { [key in Role]?: number }
// memory extension samples
interface CreepMemory {
  isDepositing: boolean
  role: Role
}

interface Memory {
  creepCount: RoleCountMap
}

type SourceMap = {
  [key: string]: { pos: RoomPosition, type: TERRAIN_MASK_WALL | TERRAIN_MASK_SWAMP | 0, isOccupied: boolean }
}

type EnergyStorage = StructureExtension | StructureSpawn | StructureContainer

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
