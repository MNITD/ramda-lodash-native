import { runBenchmarks } from "https://deno.land/std@0.83.0/testing/bench.ts";
import {
  prettyBenchmarkProgress,
  prettyBenchmarkResult,
} from "https://deno.land/x/pretty_benching@v0.3.2/mod.ts";

import "./lessThanThreeDigits.ts";
import "./doubleAdd4.ts";
import "./filterGuideRoute.ts";
import "./filterApps.ts";
import "./traceIdSelector.ts";
import "./reduxLens.ts";

await runBenchmarks({ silent: true }, prettyBenchmarkProgress())
// .then(prettyBenchmarkResult());
