import { Manager } from "./genericManager";

export class TaskManager extends Manager {
  private checkLocation(creep: Creep, target: RoomPosition) {
    return (creep.pos.isEqualTo(target.x, target.y))
  }

  private clearTask(creep: Creep) {
    creep.memory.ongoingTask = undefined
  }

  private assignTasks() {
    for (const id of this.creepIDs) {
      const creep = Game.creeps[id]

      if (creep.memory.ongoingTask) {
        let creepUsed = true
        switch (creep.memory.ongoingTask.type) {
          case 'move':
            if (creep.moveTo(creep.memory.ongoingTask.field.target) !== OK) this.clearTask(creep)
            if (this.checkLocation(creep, creep.memory.ongoingTask.field.target)) this.clearTask(creep)
            break
          case 'withdraw':
            creep.withdraw(creep.memory.ongoingTask.field, 'energy')
            break
          default:
            creepUsed = false
            break
        }

        if (creepUsed)
          this.usedCreeps.push(id)
      }
    }
    return this.unusedCreeps
  }

  public manage(): string[] {
    return this.assignTasks()
  }
}
