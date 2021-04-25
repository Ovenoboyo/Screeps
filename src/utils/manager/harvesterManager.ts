import { Harvester } from "utils/roles/harvester"
import { findStorageToDeposit } from "./energyStorageManager"

export class HarvesterManager {
  private sources: Source[] = []
  private room: Room
  private creepIDs: string[]
  private occupiedCreeps: string[] = []

  public constructor(room: Room, creepIDs: string[]) {
    this.sources = room.find(FIND_SOURCES_ACTIVE)
    this.room = room
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
    new Harvester(Game.creeps[id], findStorageToDeposit(Game.creeps[id], false, false, false), source, pos).run()
  }

  private get UnusedCreeps() {
    return this.creepIDs.filter(x => !this.occupiedCreeps.includes(x));
  }

  private checkAllSources(sources: Source[]): string[] {
    for (const source of sources) {
      this.isSourceFarmable(source)
    }

    return this.UnusedCreeps
  }

  private assignHarvesters(ids: string[], sourcePositionMap: SourceMap, source: Source) {
    let position: string | undefined
    for (const id of ids) {
      if (!this.isCreepAssigned(id)) {
        if ((position = this.hasSourceEmptyTile(sourcePositionMap)) !== undefined) {
          this.generateHarvester(id, source, sourcePositionMap[position].pos)
          sourcePositionMap[position].isOccupied = true
          this.occupiedCreeps.push(id)
        }
      }
    }
  }

  private isSourceFarmable(source: Source) {
    const sourcePositionMap = this.getSourceMap(source)
    const definedHarvesters = this.creepIDs.filter((val) => Memory.creeps[val].role === "harvester")
    this.assignHarvesters(definedHarvesters, sourcePositionMap, source)
    this.assignHarvesters(this.creepIDs, sourcePositionMap, source)
  }

  public manage(): string[] {
    return this.checkAllSources(this.sources)
  }
}
