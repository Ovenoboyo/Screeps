/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ErrorMapper } from "utils/ErrorMapper";
import { GlobalManager } from "utils/manager/globalManager";
import profiler from 'screeps-profiler'

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code

profiler.enable()
export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`);

  const spawn = Game.spawns['Very Bada Spawn']
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
  profiler.wrap(() => {
    new GlobalManager(spawn).manage()
  })
});
