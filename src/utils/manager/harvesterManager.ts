import { Harvester } from "utils/roles/harvester"

type SourceMap = {
  [key: string]: { pos: RoomPosition, type: TERRAIN_MASK_WALL | TERRAIN_MASK_SWAMP | 0, isOccupied: boolean }
}

export class HarvesterManager {
  private sources: Source[] = []
  private spawn: StructureSpawn
  private room: Room
  private creepIDs: string[]
  private occupiedCreeps: string[] = []

  public constructor(spawn: StructureSpawn, creepIDs: string[]) {
    this.spawn = spawn
    this.sources = this.spawn.room.find(FIND_SOURCES_ACTIVE)
    this.room = this.spawn.room
    this.creepIDs = creepIDs
  }

  private getSourceMap(source: Source): SourceMap {
    return {
      top: { pos: new RoomPosition(source.pos.x, source.pos.y + 1, this.room.name), type: this.room.getTerrain().get(source.pos.x, source.pos.y + 1), isOccupied: false },
      bottom: { pos: new RoomPosition(source.pos.x, source.pos.y - 1, this.room.name), type: this.room.getTerrain().get(source.pos.x, source.pos.y - 1), isOccupied: false },
      left: { pos: new RoomPosition(source.pos.x - 1, source.pos.y, this.room.name), type: this.room.getTerrain().get(source.pos.x - 1, source.pos.y), isOccupied: false },
      right: { pos: new RoomPosition(source.pos.x + 1, source.pos.y, this.room.name), type: this.room.getTerrain().get(source.pos.x + 1, source.pos.y), isOccupied: false },
      rtop: { pos: new RoomPosition(source.pos.x + 1, source.pos.y + 1, this.room.name), type: this.room.getTerrain().get(source.pos.x + 1, source.pos.y + 1), isOccupied: false },
      ltop: { pos: new RoomPosition(source.pos.x + 1, source.pos.y - 1, this.room.name), type: this.room.getTerrain().get(source.pos.x + 1, source.pos.y - 1), isOccupied: false },
      rbottom: { pos: new RoomPosition(source.pos.x - 1, source.pos.y + 1, this.room.name), type: this.room.getTerrain().get(source.pos.x - 1, source.pos.y + 1), isOccupied: false },
      lbottom: { pos: new RoomPosition(source.pos.x - 1, source.pos.y - 1, this.room.name), type: this.room.getTerrain().get(source.pos.x - 1, source.pos.y - 1), isOccupied: false },
    }
  }

  private isCreepAssigned(id: string): boolean {
    return this.occupiedCreeps.includes(id)
  }

  private hasSourceEmptyTile(sourceMap: SourceMap): string | undefined {
    for (const position in sourceMap) {
      if (sourceMap[position].type === 0 && !sourceMap[position].isOccupied)
        return position
    }
    return undefined
  }

  private generateHarvester(id: string, source: Source, pos: RoomPosition) {
    new Harvester(Game.creeps[id], this.spawn, source, pos).run()
    this.occupiedCreeps.push(id)
  }

  private checkAllSources(sources: Source[]): string[] {
    for (const source of sources) {
      this.isSourceFarmable(source)
    }

    return this.getUnusedCreeps()
  }

  private getUnusedCreeps() {
    return this.creepIDs.filter(x => !this.occupiedCreeps.includes(x));
  }

  private isSourceFarmable(source: Source) {
    let position: string | undefined
    const sourcePositionMap = this.getSourceMap(source)
    for (const id of this.creepIDs) {
      if (!this.isCreepAssigned(id)) {
        if ((position = this.hasSourceEmptyTile(sourcePositionMap)) !== undefined) {
          this.generateHarvester(id, source, sourcePositionMap[position].pos)
          sourcePositionMap[position].isOccupied = true
          break
        }
      }
    }
  }

  public manage(): string[] {
    return this.checkAllSources(this.sources)
  }
}