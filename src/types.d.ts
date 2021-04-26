// example declaration file - remove these and add your own custom typings

type Role = 'soldier' | 'harvester' | 'deployer' | 'janitor' | 'builder' | 'repairer' | 'courier'
type task = {
  type: 'move'
  field: { target: RoomPosition, color?: string }
} | {
  type: 'withdraw'
  field: Structure | Ruin | Tombstone
}


type RoleCountMap = { [key in Role]?: number }
// memory extension samples
interface CreepMemory {
  isDepositing: boolean
  role: Role
  ongoingTask?: task
}

interface Creep {
  moveToCustom: (pos: RoomPosition | { pos: RoomPosition }, opts?: MoveToOpts) => CreepMoveReturnCode | -2 | -7 | -5
  withdrawCustom: (target: Structure<StructureConstant> | Ruin | Tombstone, resourceType: ResourceConstant, amount?: number | undefined) => ScreepsReturnCode
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
