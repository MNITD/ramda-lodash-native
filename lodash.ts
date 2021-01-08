import { createRequire } from 'https://deno.land/std@0.83.0/node/module.ts';

const require_ = createRequire(import.meta.url);
const lodash = require_('./lodash-npm');

export default lodash;
