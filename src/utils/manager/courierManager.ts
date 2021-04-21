import { findStorageToDeposit, findStorageToWithdraw } from "./energyStorageManager"
import { COURIER_MAX_CONTAINER_DEPOSITER } from "utils/constants"
import { Courier } from "utils/roles/courier"


export class CourierManager {
  private creepIDs: string[]

  public constructor(creepIDs: string[]) {
    this.creepIDs = creepIDs
  }

  private assignCouriers() {
    for (const [index, id] of this.creepIDs.entries()) {
      const creep = Game.creeps[id]
      if (index < COURIER_MAX_CONTAINER_DEPOSITER) {
        const withdraw = findStorageToWithdraw(creep, false, true, true)
        const deposit = findStorageToDeposit(creep, true, true, false)
        if (deposit && withdraw) {
          new Courier(Game.creeps[id], deposit, withdraw).run()
          continue
        }
      }

      if (index >= COURIER_MAX_CONTAINER_DEPOSITER && index < this.creepIDs.length) {
        const withdraw = findStorageToWithdraw(creep, true, true, false)
        const deposit = findStorageToDeposit(creep, true, false, true)
        if (deposit && withdraw) {
          new Courier(Game.creeps[id], deposit, withdraw).run()
          continue
        }
      }
    }
    return []
  }

  public manage(): string[] {
    return this.assignCouriers()
  }
}
