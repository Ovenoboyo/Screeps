import { HOSTILE_WHITELIST } from "utils/constants"
import { Tower } from "utils/roles/tower"
import { isCreepsInsufficient } from "utils/utils"

export class TowerManager {
  private towers: StructureTower[]

  public constructor() {
    this.towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER) as StructureTower[]
  }

  private assignTower() {
    for (const t of this.towers) {
      const hostile: (AnyCreep | Structure)[] = t.room.find(FIND_HOSTILE_CREEPS, { filter: creep => !HOSTILE_WHITELIST.includes(creep.owner.username) }) || (t.room.find(FIND_HOSTILE_STRUCTURES, { filter: structure => (structure.owner) ? !HOSTILE_WHITELIST.includes(structure.owner.username) : true }) as Structure[])
      const repair: AnyStructure[] = (t.store.energy >= 250) ? t.room.find(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_WALL && structure.hits < 10000) || (structure.structureType !== STRUCTURE_WALL && structure.hits < structure.hitsMax) }) : []
      if (hostile.length > 0 || repair.length > 0) {
        if ((hostile.length === 0 && !isCreepsInsufficient()) || hostile.length > 0)
          new Tower(t, hostile.length > 0 ? hostile[0] : undefined, repair.length > 0 ? repair[0] : undefined).run()
      }
    }
  }

  public manage(): void {
    this.assignTower()
  }
}
