import * as migration_20260814_172343_init from './20260814_172343_init';

export const migrations = [
  {
    up: migration_20260814_172343_init.up,
    down: migration_20260814_172343_init.down,
    name: '20260814_172343_init'
  },
];
