export class Tower {
  private tower: StructureTower
  private hostile?: AnyCreep | Structure
  private repair?: Structure

  public constructor(tower: StructureTower, hostile?: AnyCreep | Structure, repair?: Structure) {
    this.tower = tower
    this.hostile = hostile
    this.repair = repair
  }

  private repairStructure() {
    if (this.repair) return this.tower.repair(this.repair)
    return OK
  }

  private attackHostile() {
    if (this.hostile) return this.tower.attack(this.hostile)
    return OK
  }

  public run(): void {
    if (this.hostile) this.attackHostile()
    else if (this.repair) this.repairStructure()
  }
}
