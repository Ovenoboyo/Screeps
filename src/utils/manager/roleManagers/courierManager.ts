import { findStorageToDeposit, findStorageToWithdraw, findTower } from "../storageManagers/energyStorageManager"

import { Courier } from "utils/roles/courier"
import { Manager } from "../genericManager"

export class CourierManager extends Manager {
  private assignCouriers() {
    for (const id of this.creepIDs) {
      const creep = Game.creeps[id]
      const withdraw = findStorageToWithdraw(creep, true, true, false)
      const deposit = findStorageToDeposit(creep, false, false, true) || findTower(creep)
      if (withdraw || (!withdraw && Game.creeps[id].store.energy > 0 && deposit)) {
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
