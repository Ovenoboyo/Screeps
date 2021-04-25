export abstract class Manager {
  protected creepIDs: string[]
  protected usedCreeps: string[] = []
  protected room: Room
  protected spawn: StructureSpawn

  public constructor(room: Room, spawn: StructureSpawn, creepIDs: string[]) {
    this.creepIDs = creepIDs
    this.room = room
    this.spawn = spawn
  }

  protected get unusedCreeps(): string[] {
    return this.creepIDs.filter(x => !this.usedCreeps.includes(x));
  }

  public abstract manage(): string[]
}
