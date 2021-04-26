export class Soldier {
  private creep: Creep
  private hostile: AnyCreep | Structure

  public constructor(creep: Creep, hostile: Creep | Structure) {
    this.creep = creep;
    this.hostile = hostile
  }

  private attackHostile() {
    return this.creep.attack(this.hostile)
  }

  private moveToCustomHostile() {
    return this.creep.moveToCustom(this.hostile)
  }

  public run(): void {
    if (this.attackHostile() === ERR_NOT_IN_RANGE) this.moveToCustomHostile()
  }
}
