import { DEPLOYER_COLOR } from "utils/constants"

const CONTROLLER_NOT_FOUND = -12

export class Deployer {
  private creep: Creep
  private spawn: StructureSpawn
  private controller?: StructureController
  private isUpgrader: boolean

  public constructor(creep: Creep, spawn: StructureSpawn, isUpgrader: boolean) {
    this.creep = creep;
    this.spawn = spawn
    this.controller = this.creep.room.controller
    this.isUpgrader = isUpgrader
  }

  private moveToController() {
    if (this.controller)
      this.creep.moveTo(this.controller, { visualizePathStyle: { stroke: DEPLOYER_COLOR } })
  }

  private depositInController() {
    if (this.controller)
      return this.creep.transfer(this.controller, "energy")
    return CONTROLLER_NOT_FOUND
  }

  private checkControllerUpgrade() {
    if (this.isUpgrader) {
      if (this.controller && (this.controller.progress / this.controller.progressTotal) >= 1) {
        this.creep.upgradeController(this.controller)
      }
    }
  }

  private moveToSpawn() {
    this.creep.moveTo(this.spawn, { visualizePathStyle: { stroke: DEPLOYER_COLOR } })
  }

  private shouldCollect(): boolean {
    return this.creep.store.getFreeCapacity() === this.creep.store.getCapacity()
  }

  private storageHasEvergy() {
    return this.spawn.store.energy === 300
  }

  public run(): void {
    if (this.shouldCollect()) {
      this.moveToSpawn()
      if (this.storageHasEvergy())
        this.creep.withdraw(this.spawn, "energy")
    } else {
      if (this.depositInController() === ERR_NOT_IN_RANGE) this.moveToController()
    }
    this.checkControllerUpgrade()
  }
}
