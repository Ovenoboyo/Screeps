import { findDroppedEnergy, findRuin, findStorageToDeposit } from "../storageManagers/energyStorageManager"

import { Janitor } from "utils/roles/janitor"
import { Manager } from "../genericManager"

export class JanitorManager extends Manager {
  private assignDeployers() {
    for (const id of this.creepIDs) {
      const creep = Game.creeps[id]
      const deposit = findStorageToDeposit(creep, false, false, false)
      const dropped: Resource<'energy'> | Ruin = findDroppedEnergy(creep) || findRuin(creep)
      if (deposit && dropped) {
        new Janitor(creep, deposit, dropped).run()
        this.usedCreeps.push(id)
      }
    }
    return this.unusedCreeps
  }

  public manage(): string[] {
    return this.assignDeployers()
  }
}
