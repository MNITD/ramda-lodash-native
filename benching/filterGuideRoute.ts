import {
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.83.0/testing/bench.ts";
import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import {
  prettyBenchmarkProgress,
  prettyBenchmarkResult,
} from "https://deno.land/x/pretty_benching@v0.3.2/mod.ts";

import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

type Route = {
  tags: {
    name: string;
    source: string;
  };
};

const GUIDE_ROUTE_NAMES = {
  routeName1: "routeName1",
  routeName2: "routeName2",
  routeName3: "routeName3",
};
const GUIDE_ROUTE_SOURCES = {
  routeSource1: "routeSource1",
  routeSource2: "routeSource2",
  routeSource3: "routeSource3",
};

const routesArray = [
  { tags: { name: "routeName", source: "routeSource" } },
  { tags: { name: "routeName", source: "routeSource1" } },
  { tags: { name: "routeName2", source: "routeSource" } },
  { tags: { name: "routeName3", source: "routeSource3" } },
];

const assertFilterGuideRoute = (result?: Route) =>
  assertEquals(result, routesArray[3]);

bench({
  name: "ramda_filterGuideRoute",
  runs: 100,
  func(b): void {
    b.start();
    const routeNameLens = R.lensPath(["tags", "name"]);
    const routeSourceLens = R.lensPath(["tags", "source"]);

    const filterGuideRoute = R.allPass([
      R.pipe(R.view(routeNameLens), R.includes(R.__, R.values(GUIDE_ROUTE_NAMES))),
      R.pipe(R.view(routeSourceLens), R.includes(R.__, R.values(GUIDE_ROUTE_SOURCES))),
    ]);

    const result = routesArray.find(filterGuideRoute);
    b.stop();

    assertFilterGuideRoute(result);
  },
});

bench({
  name: "native_filterGuideRoute",
  runs: 100,
  func(b): void {
    b.start();

    const filterGuideRoute = (route: Route) => {
      const guidesNamesValue = Object.values(GUIDE_ROUTE_NAMES);
      const guidesSourcesValue = Object.values(GUIDE_ROUTE_SOURCES);

      return guidesNamesValue.includes(route?.tags?.name) &&
        guidesSourcesValue.includes(route?.tags?.source);
    };

    const result = routesArray.find(filterGuideRoute);
    b.stop();

    assertFilterGuideRoute(result);
  },
});

if (import.meta.main) {
  await runBenchmarks({ silent: true }, prettyBenchmarkProgress())
  // .then(prettyBenchmarkResult());
}
