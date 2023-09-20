#!/usr/bin/env node

import { edit } from './index.js';

edit(process.argv.length > 2 ? process.argv[2] : undefined);
