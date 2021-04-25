import { Soldier } from "utils/roles/soldier";

export class SoldierManager {
  private creepIDs: string[]
  private room: Room
  private usedCreeps: string[] = []

  public constructor(room: Room, creepIDs: string[]) {
    this.creepIDs = creepIDs
    this.room = room
  }

  private get UnusedCreeps(): string[] {
    return this.creepIDs.filter(x => !this.usedCreeps.includes(x));
  }

  private findHostile(): Creep[] | Structure[] {
    return this.room.find(FIND_HOSTILE_CREEPS) || (Game.creeps[this.creepIDs[0]].room.find(FIND_HOSTILE_STRUCTURES) as Structure[])
  }

  private assignSoldiers() {
    const hostile = this.findHostile()
    if (hostile.length > 0) {
      for (const id of this.creepIDs) {
        new Soldier(Game.creeps[id], hostile[0]).run()
        this.usedCreeps.push(id)
      }
    }
    return this.UnusedCreeps
  }

  public manage(): string[] {
    return this.assignSoldiers()
  }
}
