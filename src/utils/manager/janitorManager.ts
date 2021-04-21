import { findDroppedEnergy, findRuin, findStorageToDeposit } from "./energyStorageManager"
import { Janitor } from "utils/roles/janitor"

export class JanitorManager {
  private creepIDs: string[]
  private usedCreeps: string[] = []

  public constructor(creepIDs: string[]) {
    this.creepIDs = creepIDs
  }

  private assignDeployers() {
    for (const id of this.creepIDs) {
      const creep = Game.creeps[id]
      const deposit = findStorageToDeposit(creep, false, false, false)
      const dropped = findDroppedEnergy(creep)
      if (deposit && dropped) {
        new Janitor(creep, deposit, dropped).run()
        this.usedCreeps.push(id)
      }
    }
    return this.UnusedCreeps
  }

  private get UnusedCreeps(): string[] {
    return this.creepIDs.filter(x => !this.usedCreeps.includes(x));
  }

  public manage(): string[] {
    return this.assignDeployers()
  }
}
