export const HARVESTER_COLOR = "#2d7dfc"
export const DEPLOYER_COLOR = "#fcb017"
export const BUILDER_COLOR = "#17fc6b"
export const COURIER_COLOR = "#eb5ef7"
export const REPAIRER_COLOR = "#fcff5c"
export const JANITOR_COLOR = "#fc0366"

export const JANITOR_SPAWN_COUNT = 0
export const COURIER_SPAWN_COUNT = 1
export const BUILDER_SPAWN_COUNT = 2
export const REPAIRER__SPAWN_COUNT = 0
export const HARVESTER_SPAWN_COUNT = 3
export const DEPLOYER_SPAWN_COUNT = 3
export const SOLDIER_SPAWN_COUNT = 3

export const JANITOR_COUNT = 1
export const COURIER_COUNT = COURIER_SPAWN_COUNT
export const BUILDER_COUNT = 3
export const REPAIRER_COUNT = 2
export const SOLDIER_COUNT = SOLDIER_SPAWN_COUNT
// export const HARVESTER_COUNT = HARVESTER_SPAWN_COUNT
// export const DEPLOYER_COUNT = DEPLOYER_SPAWN_COUNT

export const TOTAL_CREEPS_COUNT = JANITOR_SPAWN_COUNT + COURIER_SPAWN_COUNT + BUILDER_SPAWN_COUNT + REPAIRER__SPAWN_COUNT + HARVESTER_SPAWN_COUNT + DEPLOYER_SPAWN_COUNT + SOLDIER_SPAWN_COUNT

const HARVESTER_BODY = [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY]
const COURIER_BODY = [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]
const BUILDER_BODY = [MOVE, MOVE, CARRY, WORK, WORK]
const DEPLOYER_BODY = [MOVE, MOVE, WORK, WORK, CARRY, CARRY]
const SOLDIER_BODY = [TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK]

export const preferredCounts: { [key in Role]: { count: number, body: BodyPartConstant[] } } = {
  'janitor': { count: JANITOR_SPAWN_COUNT, body: HARVESTER_BODY },
  'courier': { count: COURIER_SPAWN_COUNT, body: COURIER_BODY },
  'builder': { count: BUILDER_SPAWN_COUNT, body: BUILDER_BODY },
  'repairer': { count: REPAIRER__SPAWN_COUNT, body: BUILDER_BODY },
  'harvester': { count: HARVESTER_SPAWN_COUNT, body: HARVESTER_BODY },
  'deployer': { count: DEPLOYER_SPAWN_COUNT, body: DEPLOYER_BODY },
  'soldier': { count: SOLDIER_SPAWN_COUNT, body: SOLDIER_BODY },
}

export const COURIER_MAX_CONTAINER_DEPOSITER = 3

export const SPAWN1 = 'Very Bada Spawn'
