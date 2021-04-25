import { findStorageToDeposit, findStorageToWithdraw } from "./energyStorageManager"
import { Courier } from "utils/roles/courier"


export class CourierManager {
  private creepIDs: string[]
  private usedCreeps: string[] = []

  public constructor(creepIDs: string[]) {
    this.creepIDs = creepIDs
  }

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
    return this.UnusedCreeps
  }

  private get UnusedCreeps(): string[] {
    return this.creepIDs.filter(x => !this.usedCreeps.includes(x));
  }

  public manage(): string[] {
    return this.assignCouriers()
  }
}
