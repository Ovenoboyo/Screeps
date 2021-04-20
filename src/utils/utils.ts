export function bodyCost(body: BodyPartConstant[]): number {
  let sum = 0;
  for (const part of body)
    sum += BODYPART_COST[part];
  return sum;
}

export function randomName(): string {
  const name = getRandomString(12)
  if (Game.creeps[name]) {
    return randomName()
  }
  return name
}

function getRandomString(length: number) {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}

export function findNearestStorage(creep: Creep): StructureExtension | StructureSpawn | null {
  return creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
    filter: (structure) => (structure.structureType === STRUCTURE_EXTENSION
      || structure.structureType === STRUCTURE_SPAWN)
      && structure.store.energy < structure.store.getCapacity("energy")
  }) as StructureExtension | StructureSpawn | null
}
