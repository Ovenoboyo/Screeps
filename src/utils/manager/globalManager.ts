import { BUILDER_COUNT, COURIER_COUNT, JANITOR_COUNT, REPAIRER_COUNT, TOTAL_CREEPS_COUNT, preferredCounts } from 'utils/constants'
import { bodyCost, getTotalSpawnEnergy, randomName } from 'utils/utils'
import { BuilderManager } from './builderManager'
import { CourierManager } from './courierManager'
import { DeployerManager } from './deployerManager'
import { HarvesterManager } from './harvesterManager'
import { JanitorManager } from './janitorManager'
import { RepairerManager } from './repairerManager'

export class GlobalManager {
  private spawn: StructureSpawn
  private creepIDs: string[]

  public constructor(spawn: StructureSpawn) {
    this.spawn = spawn
    this.creepIDs = Object.keys(Game.creeps).sort()
  }

  private spawnCreeps() {
    if (Memory.creepCount === undefined) {
      this.repopulateCounts()
    }

    if (Object.keys(Game.creeps).length < TOTAL_CREEPS_COUNT) {
      if (this.spawn.spawning == null) {
        this.repopulateCounts()
        const roles: Role[] = ['builder', 'courier', 'deployer', 'harvester', 'janitor', 'repairer']

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
    this.creepIDs.push(...new JanitorManager(this.nextCreep('janitor', JANITOR_COUNT)).manage())
    this.creepIDs.push(...new HarvesterManager(this.spawn.room, this.nextCreep('harvester')).manage())
    this.creepIDs.push(...new BuilderManager(this.spawn.room, this.nextCreep('builder', BUILDER_COUNT)).manage())
    this.creepIDs.push(...new CourierManager(this.nextCreep('courier', COURIER_COUNT)).manage())
    this.creepIDs.push(...new RepairerManager(this.spawn.room, this.nextCreep('repairer', REPAIRER_COUNT)).manage())
    this.creepIDs.push(...new DeployerManager(this.spawn, this.nextCreep('deployer')).manage())

    for (const id of this.creepIDs) {
      Game.creeps[id].moveTo(21, 19)
    }
  }

  private forceDepositToSpawn(creep: Creep) {
    if (creep.store.getUsedCapacity() > 0) {
      creep.moveTo(this.spawn, { visualizePathStyle: { stroke: "#ffffff" } })
      creep.transfer(this.spawn, "energy")
    }
  }

  private nextCreep(role: Role, no?: number) {
    let matches: string[] = []
    for (let i = this.creepIDs.length - 1; i >= 0; i--) {
      if (Game.creeps[this.creepIDs[i]].memory.role === role) {
        matches.push(this.creepIDs[i])
        this.creepIDs.splice(i, 1)
      }
    }

    if (no && matches.length >= no) {
      matches = matches.slice(0, no)
    } else {
      let count = 0
      for (let i = this.creepIDs.length - 1; i >= 0; i--) {
        if ((no && count < no) || no === undefined) {
          if (this.canSubstitute(role, (Memory.creeps[this.creepIDs[i]].role))) {
            matches.push(this.creepIDs[i])
            this.creepIDs.splice(i, 1)
            count++
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
