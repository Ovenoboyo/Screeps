import { SPAWN1 } from "./constants";

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

export function getTotalSpawnEnergy(): number {
  let totalCapacity = 0
  const spawn = Game.spawns[SPAWN1]

  totalCapacity += spawn.store.energy
  const extensions: StructureExtension[] = spawn.room.find(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType === STRUCTURE_EXTENSION }) as StructureExtension[]
  for (const e of extensions) {
    totalCapacity += e.store.energy
  }

  return totalCapacity
}
