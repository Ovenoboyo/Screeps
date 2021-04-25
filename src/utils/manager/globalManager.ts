import { BUILDER_COUNT, COURIER_COUNT, JANITOR_COUNT, preferredCounts } from 'utils/constants'
import { bodyCost, getTotalSpawnEnergy, isCreepsInsufficient, randomName } from 'utils/utils'

import { BuilderManager } from './roleManagers/builderManager'
import { CourierManager } from './roleManagers/courierManager'
import { DeployerManager } from './roleManagers/deployerManager'
import { HarvesterManager } from './roleManagers/harvesterManager'
import { JanitorManager } from './roleManagers/janitorManager'
import { SoldierManager } from './roleManagers/soldierManager'
import { TowerManager } from './structureManagers/towerManager'

export class GlobalManager {
  private spawn: StructureSpawn
  private creepIDs: { [key: string]: string[] } = {}

  public constructor(spawn: StructureSpawn) {
    this.spawn = spawn

    const creeps = Object.keys(Game.creeps).sort()
    for (const c of creeps) {
      const room = Game.creeps[c].room.name
      if (this.creepIDs[room]) this.creepIDs[room].push(c)
      else this.creepIDs[room] = [c]
    }
  }

  private spawnCreeps() {
    if (Memory.creepCount === undefined) {
      this.repopulateCounts()
    }


    if (isCreepsInsufficient()) {
      if (this.spawn.spawning == null) {
        this.repopulateCounts()
        const roles: Role[] = ['soldier', 'builder', 'courier', 'deployer', 'harvester', 'janitor', 'repairer']

        for (const key of roles) {
          const memoryCount = Memory.creepCount[key]
          if ((memoryCount ? memoryCount : 0) < preferredCounts[key].count && getTotalSpawnEnergy() >= bodyCost(preferredCounts[key].body)) {
            this.spawn.spawnCreep(preferredCounts[key].body, randomName(), { memory: { role: key, isDepositing: false } })
            this.incCount(key)
          }
        }
      }
    }
  }

  private repopulateCounts() {
    Memory.creepCount = {}
    for (const c in Game.creeps) {
      if (Game.creeps[c].memory.role)
        this.incCount(Game.creeps[c].memory.role)
    }
  }

  private incCount(role: Role) {
    if (Memory.creepCount[role] !== undefined)
      Memory.creepCount[role]! += 1
    else
      Memory.creepCount[role] = 1
  }

  private assignRoles() {
    for (const room in this.creepIDs) {
      this.creepIDs[room].push(...new JanitorManager(Game.rooms[room], this.spawn, this.nextCreep('janitor', room, JANITOR_COUNT, true)).manage())
      this.creepIDs[room].push(...new HarvesterManager(Game.rooms[room], this.spawn, this.nextCreep('harvester', room, undefined, true)).manage())
      this.creepIDs[room].push(...new CourierManager(Game.rooms[room], this.spawn, this.nextCreep('courier', room, COURIER_COUNT, false)).manage())
      this.creepIDs[room].push(...new SoldierManager(Game.rooms[room], this.spawn, this.nextCreep('soldier', room, COURIER_COUNT, false)).manage())

      if (!isCreepsInsufficient()) {
        this.creepIDs[room].push(...new BuilderManager(Game.rooms[room], this.spawn, this.nextCreep('builder', room, BUILDER_COUNT, true)).manage())
        // this.creepIDs[room].push(...new RepairerManager(Game.rooms[room], this.spawn, this.nextCreep('repairer', room, REPAIRER_COUNT, true)).manage())
        this.creepIDs[room].push(...new DeployerManager(Game.rooms[room], this.spawn, this.nextCreep('deployer', room, undefined, false)).manage())
      }
    }

    new TowerManager().manage()

    // for (const id of this.creepIDs) {
    //   if (Game.creeps[id].transfer(this.spawn, 'energy') === ERR_NOT_IN_RANGE) Game.creeps[id].moveTo(this.spawn)
    // }


    for (const room in this.creepIDs) {
      for (const id of this.creepIDs[room]) {
        if (Game.creeps[id].store.energy > 0) this.forceDepositToSpawn(Game.creeps[id])
        else Game.creeps[id].moveTo(36, 17)
      }
    }
  }

  private forceDepositToSpawn(creep: Creep) {
    if (creep.transfer(this.spawn, "energy") === ERR_NOT_IN_RANGE) creep.moveTo(this.spawn, { visualizePathStyle: { stroke: "#ffffff" } })

  }

  private nextCreep(role: Role, room: string, no?: number, shouldSubstitute?: boolean) {
    let matches: string[] = []
    for (let i = this.creepIDs[room].length - 1; i >= 0; i--) {
      if (Game.creeps[this.creepIDs[room][i]].memory.role === role) {
        matches.push(this.creepIDs[room][i])
        this.creepIDs[room].splice(i, 1)
      }
    }

    if (shouldSubstitute) {
      if (no && matches.length >= no) {
        matches = matches.slice(0, no)
      } else {
        let count = matches.length
        for (let i = this.creepIDs[room].length - 1; i >= 0; i--) {
          if ((no && count < no) || no === undefined) {
            if (this.canSubstitute(role, (Memory.creeps[this.creepIDs[room][i]].role))) {
              matches.push(this.creepIDs[room][i])
              this.creepIDs[room].splice(i, 1)
              count++
            }
          }
        }
      }
    }
    return matches
  }

  private canSubstitute(roleRequired: Role, creepRole: Role) {
    if (creepRole && roleRequired)
      return preferredCounts[roleRequired].body.every(e => preferredCounts[creepRole].body.includes(e))
    return true
  }

  public manage(): void {
    this.spawnCreeps()
    this.assignRoles()
  }
}
