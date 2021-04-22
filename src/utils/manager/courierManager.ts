import { findStorageToDeposit, findStorageToWithdraw } from "./energyStorageManager"
import { Courier } from "utils/roles/courier"


export class CourierManager {
  private creepIDs: string[]

  public constructor(creepIDs: string[]) {
    this.creepIDs = creepIDs
  }

  private assignCouriers() {
    for (const id of this.creepIDs) {
      const creep = Game.creeps[id]
      const withdraw = findStorageToWithdraw(creep, true, true, false)
      const deposit = findStorageToDeposit(creep, false, false, true)
      new Courier(Game.creeps[id], deposit, withdraw).run()
    }
    return []
  }

  public manage(): string[] {
    return this.assignCouriers()
  }
}
