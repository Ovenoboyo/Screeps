export const HARVESTER_COLOR = "#2d7dfc"
export const DEPLOYER_COLOR = "#fcb017"
export const BUILDER_COLOR = "#17fc6b"
export const COURIER_COLOR = "#eb5ef7"
export const REPAIRER_COLOR = "#fcff5c"
export const JANITOR_COLOR = "#fc0366"

export const JANITOR_SPAWN_COUNT = 0
export const COURIER_SPAWN_COUNT = 3
export const BUILDER_SPAWN_COUNT = 3
export const REPAIRER__SPAWN_COUNT = 0
export const HARVESTER_SPAWN_COUNT = 7
export const DEPLOYER_SPAWN_COUNT = 5

export const JANITOR_COUNT = 1
export const COURIER_COUNT = COURIER_SPAWN_COUNT
export const BUILDER_COUNT = BUILDER_SPAWN_COUNT
export const REPAIRER_COUNT = 2
// export const HARVESTER_COUNT = HARVESTER_SPAWN_COUNT
// export const DEPLOYER_COUNT = DEPLOYER_SPAWN_COUNT

export const TOTAL_CREEPS_COUNT = JANITOR_SPAWN_COUNT + COURIER_SPAWN_COUNT + BUILDER_SPAWN_COUNT + REPAIRER__SPAWN_COUNT + HARVESTER_SPAWN_COUNT + DEPLOYER_SPAWN_COUNT

const HARVESTER_BODY = [WORK, CARRY, CARRY, MOVE, MOVE]
const DEPLOYER_BODY = [CARRY, CARRY, CARRY, MOVE, MOVE]

export const preferredCounts: { [key in Role]: { count: number, body: BodyPartConstant[] } } = {
  'janitor': { count: JANITOR_SPAWN_COUNT, body: DEPLOYER_BODY },
  'courier': { count: COURIER_SPAWN_COUNT, body: DEPLOYER_BODY },
  'builder': { count: BUILDER_SPAWN_COUNT, body: HARVESTER_BODY },
  'repairer': { count: REPAIRER__SPAWN_COUNT, body: HARVESTER_BODY },
  'harvester': { count: HARVESTER_SPAWN_COUNT, body: HARVESTER_BODY },
  'deployer': { count: DEPLOYER_SPAWN_COUNT, body: DEPLOYER_BODY },
}


export const COURIER_MAX_CONTAINER_DEPOSITER = 3

export const SPAWN1 = 'Very Bada Spawn'
