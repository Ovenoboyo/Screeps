// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  room: string;
  working: boolean;
}

interface Memory {
  uuid: number;
  log: any;
}

type SourceMap = {
  [key: string]: { pos: RoomPosition, type: TERRAIN_MASK_WALL | TERRAIN_MASK_SWAMP | 0, isOccupied: boolean }
}

type EnergyStorage = StructureExtension | StructureSpawn

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
