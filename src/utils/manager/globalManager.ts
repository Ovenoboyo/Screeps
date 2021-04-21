import { BUILDER_COUNT, COURIER_COUNT, JANITOR_COUNT, REPAIRER_COUNT } from 'utils/constants'
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
    if (Object.keys(Game.creeps).length < 18) {
      if (getTotalSpawnEnergy() >= bodyCost([WORK, CARRY, CARRY, MOVE]) && this.spawn.spawning == null) {
        this.spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], randomName())
      }
    }
  }

  private assignRoles() {
    this.creepIDs.push(...new JanitorManager(this.nextCreep(JANITOR_COUNT)).manage())
    this.creepIDs.push(...new HarvesterManager(this.spawn.room, this.nextCreep()).manage())
    this.creepIDs.push(...new CourierManager(this.nextCreep(COURIER_COUNT)).manage())
    this.creepIDs.push(...new BuilderManager(this.spawn.room, this.nextCreep(BUILDER_COUNT)).manage())
    this.creepIDs.push(...new RepairerManager(this.spawn.room, this.nextCreep(REPAIRER_COUNT)).manage())
    this.creepIDs.push(...new DeployerManager(this.spawn, this.nextCreep()).manage())

    for (const id of this.creepIDs) {
      // this.forceDepositToSpawn(Game.creeps[id])
      Game.creeps[id].moveTo(21, 19)
    }
  }

  private forceDepositToSpawn(creep: Creep) {
    if (creep.store.getUsedCapacity() > 0) {
      creep.moveTo(this.spawn, { visualizePathStyle: { stroke: "#ffffff" } })
      creep.transfer(this.spawn, "energy")
    }
  }

  private nextCreep(no?: number) {
    return this.creepIDs.splice(0, (no) ? no : this.creepIDs.length)
  }

  public manage(): void {
    this.spawnCreeps()
    this.assignRoles()
  }
}
