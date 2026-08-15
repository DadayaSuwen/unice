import * as migration_20260814_172343_init from './20260814_172343_init';
import * as migration_20260815_010250 from './20260815_010250';

export const migrations = [
  {
    up: migration_20260814_172343_init.up,
    down: migration_20260814_172343_init.down,
    name: '20260814_172343_init',
  },
  {
    up: migration_20260815_010250.up,
    down: migration_20260815_010250.down,
    name: '20260815_010250'
  },
];
