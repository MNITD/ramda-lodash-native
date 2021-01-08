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

enum CatalogTab {
  INSTALLED = 'Installed',
}

type App = {
  name: string;
  fqn: string;
}


const searchValue = 'stripe'
const installedApps: {byId: Record<string, string>} = {
  byId: {
    'stripe2': 'installedApp'
  }
}
const activeTab = CatalogTab.INSTALLED

const apps = [
  {name: 'name', fqn: 'fqn1'},
  {name: 'stripe1', fqn: 'stripe1'},
  {name: 'name', fqn: 'fqn3'},
  {name: 'name', fqn: 'fqn4'},
  {name: 'stripe2', fqn: 'stripe2'},
]

const assertFilterApps = (result: App[]) => assertEquals(result, [apps[4]])

bench({
  name: "ramda_filterApps",
  runs: 100,
  func(b): void {
    b.start();
    const filterAppsBySearch = R.when(
      () => !!searchValue,
      R.filter((app: App) => app.name.toLowerCase().startsWith(searchValue.toLowerCase())),
    );

    const filterInstalledApps = R.when(
      () => activeTab === CatalogTab.INSTALLED,
      R.filter((app: App) => installedApps.byId[app.fqn]),
    );

    const filterApps = R.pipe(filterInstalledApps, filterAppsBySearch);

    const result = filterApps(apps)

    b.stop();

    assertFilterApps(result)
  },
});

bench({
  name: "native_filterApps",
  runs: 100,
  func(b): void {
    b.start();

    const filterApps = (apps: App[]) => {
      let res = apps;
      if(!!searchValue){
        res = res.filter((app: App) => app.name.toLowerCase().startsWith(searchValue.toLowerCase()))
      }
      if(activeTab === CatalogTab.INSTALLED){
        res = res.filter((app: App) => installedApps.byId[app.fqn])
      }
      return res
    };

    const result = filterApps(apps)

    b.stop();

    assertFilterApps(result)
  },
});

if (import.meta.main) {
  await runBenchmarks({ silent: true }, prettyBenchmarkProgress())
  // .then(prettyBenchmarkResult());
}
