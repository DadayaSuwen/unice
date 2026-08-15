import * as migration_20260814_172343_init from './20260814_172343_init';
import * as migration_20260815_010250 from './20260815_010250';
import * as migration_20260815_035530 from './20260815_035530';
import * as migration_20260815_073328 from './20260815_073328';
import * as migration_20260815_083819 from './20260815_083819';
import * as migration_20260815_084752 from './20260815_084752';
import * as migration_20260815_091550 from './20260815_091550';

export const migrations = [
  {
    up: migration_20260814_172343_init.up,
    down: migration_20260814_172343_init.down,
    name: '20260814_172343_init',
  },
  {
    up: migration_20260815_010250.up,
    down: migration_20260815_010250.down,
    name: '20260815_010250',
  },
  {
    up: migration_20260815_035530.up,
    down: migration_20260815_035530.down,
    name: '20260815_035530',
  },
  {
    up: migration_20260815_073328.up,
    down: migration_20260815_073328.down,
    name: '20260815_073328',
  },
  {
    up: migration_20260815_083819.up,
    down: migration_20260815_083819.down,
    name: '20260815_083819',
  },
  {
    up: migration_20260815_084752.up,
    down: migration_20260815_084752.down,
    name: '20260815_084752',
  },
  {
    up: migration_20260815_091550.up,
    down: migration_20260815_091550.down,
    name: '20260815_091550'
  },
];
