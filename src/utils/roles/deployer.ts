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

  private moveToCustomController() {
    if (this.controller)
      this.creep.moveToCustom(this.controller, { visualizePathStyle: { stroke: DEPLOYER_COLOR } })
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

  private moveToCustomSpawn() {
    this.creep.moveToCustom(this.spawn, { visualizePathStyle: { stroke: DEPLOYER_COLOR } })
  }

  private shouldCollect(): boolean {
    return this.creep.store.getFreeCapacity() === this.creep.store.getCapacity()
  }

  public run(): void {
    if (this.shouldCollect()) {
      this.moveToCustomSpawn()
      this.creep.withdraw(this.spawn, "energy")
    } else {
      if (this.depositInController() === ERR_NOT_IN_RANGE) this.moveToCustomController()
    }
    this.checkControllerUpgrade()
  }
}
