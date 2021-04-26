import { HOSTILE_WHITELIST } from "utils/constants";
import { Manager } from "../genericManager";
import { Soldier } from "utils/roles/soldier";

export class SoldierManager extends Manager {
  private findHostile(): Creep[] | Structure[] {
    return this.room.find(FIND_HOSTILE_CREEPS, { filter: creep => !HOSTILE_WHITELIST.includes(creep.owner.username) }) || (Game.creeps[this.creepIDs[0]].room.find(FIND_HOSTILE_STRUCTURES, { filter: structure => structure.owner ? !HOSTILE_WHITELIST.includes(structure.owner.username) : true }) as Structure[])
  }

  private assignSoldiers() {
    const hostile = this.findHostile()
    if (hostile.length > 0) {
      for (const id of this.creepIDs) {
        new Soldier(Game.creeps[id], hostile[0]).run()
        this.usedCreeps.push(id)
      }
    }
    return this.unusedCreeps
  }

  public manage(): string[] {
    return this.assignSoldiers()
  }
}
