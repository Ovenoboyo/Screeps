import { findStorageToDeposit, findStorageToWithdraw } from "../storageManagers/energyStorageManager"

import { Courier } from "utils/roles/courier"
import { Manager } from "../genericManager"

export class CourierManager extends Manager {
  private assignCouriers() {
    for (const id of this.creepIDs) {
      const creep = Game.creeps[id]
      const withdraw = findStorageToWithdraw(creep, true, true, false)
      const deposit = findStorageToDeposit(creep, false, false, true)
      if (withdraw) {
        new Courier(Game.creeps[id], deposit, withdraw).run()
        this.usedCreeps.push(id)
      }
    }
    return this.unusedCreeps
  }
  public manage(): string[] {
    return this.assignCouriers()
  }
}
