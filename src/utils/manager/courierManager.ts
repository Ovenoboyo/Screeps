import { findStorageToDeposit, findStorageToWithdraw } from "./energyStorageManager"

import { Courier } from "utils/roles/courier"

export class CourierManager {
  private creepIDs: string[]

  public constructor(creepIDs: string[]) {
    this.creepIDs = creepIDs
  }

  private assignCouriers() {
    for (const [index, id] of this.creepIDs.entries()) {
      const creep = Game.creeps[id]
      if (index < 3) {
        const withdraw = findStorageToWithdraw(creep, false, true, true)
        const deposit = findStorageToDeposit(creep, true, true, false)
        if (deposit && withdraw) {
          new Courier(Game.creeps[id], deposit, withdraw).run()
          continue
        }
      }

      if (index >= 3 && index < this.creepIDs.length) {
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
