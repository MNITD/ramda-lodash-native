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

type State = {
  isInstallationLoading: boolean;
  isInstallationCreating: boolean;
  installation: null;
  instances: {byId: Record<string, any>, ids: string[]};
}

const a1 = {
  data: {
    vault_id: 'someVaultId',
    state: 'INSTALLING',
    config: {
     csv: '1234'
    },
  },
}

const a2 = {
  data: {
    id: 'someVaultId',
  }
}

const expectedStateAppended = {
  isInstallationLoading: false,
  isInstallationCreating: false,
  installation: null,
  instances: {
    byId: {
      'someVaultId': {
        vault_id: 'someVaultId',
        state: 'INSTALLING',
        config: {
          csv: '1234'
        },
      },
    },
    ids: ['someVaultId'],
  },
}

const expectedStateDeleted = {
  isInstallationLoading: false,
  isInstallationCreating: false,
  installation: null,
  instances: {
    byId: {
      'otherVaultId': {
        vault_id: 'otherVaultId',
        state: 'INSTALLING',
        config: {
          csv: '5678'
        },
      }
    },
    ids: ['otherVaultId'],
  },
}

const getStateEmpty = () => ({
  isInstallationLoading: false,
  isInstallationCreating: false,
  installation: null,
  instances: {
    byId: {},
    ids: [],
  },
})

const getStateWithInstances = (): State => ({
  isInstallationLoading: false,
  isInstallationCreating: false,
  installation: null,
  instances: {
    byId: {
      'someVaultId': {
        vault_id: 'someVaultId',
        state: 'INSTALLING',
        config: {
          csv: '1234'
        },
      },
      'otherVaultId': {
        vault_id: 'otherVaultId',
        state: 'INSTALLING',
        config: {
          csv: '5678'
        },
      }
    },
    ids: ['someVaultId', 'otherVaultId'],
  },
})
const assertReduxLensAppend = (result: any) => {
  assertEquals(result, expectedStateAppended)
}

const assertReduxLensDelete = (result: any) => {
  assertEquals(result, expectedStateDeleted)
}


bench({
  name: "ramda_reduxLens_append",
  runs: 100,
  func(b): void {
    b.start();

    const instancesByIdLens = R.lensPath(['instances', 'byId']);
    const instancesIdsLens = R.lensPath(['instances', 'ids']);

    const state = getStateEmpty();

    const result = R.pipe(
      R.over(instancesByIdLens, R.assoc(a1.data.vault_id, a1.data)),
      R.over(instancesIdsLens, R.append(a1.data.vault_id)),
    )(state);

    b.stop();

    assertReduxLensAppend(result)
  },
});

bench({
  name: "native_reduxLens_append",
  runs: 100,
  func(b): void {
    b.start();

    const state = getStateEmpty();

    const result = {
      ...state,
      instances: {
        ...state.instances,
        byId: {
          ...state.instances.byId,
          [a1.data.vault_id]: a1.data,
        },
        ids: [...state.instances.ids, a1.data.vault_id],
      },
    };

    b.stop();

    assertReduxLensAppend(result)
  },
});

bench({
  name: "ramda_reduxLens_delete",
  runs: 100,
  func(b): void {
    b.start();

    const instancesByIdLens = R.lensPath(['instances', 'byId']);
    const instancesIdsLens = R.lensPath(['instances', 'ids']);

    const state = getStateWithInstances();

    const result = R.pipe(
      R.over(instancesByIdLens, R.dissoc(a2.data.id)),
      R.over(instancesIdsLens, R.without([a2.data.id])),
    )(state)

    b.stop();

    assertReduxLensDelete(result)
  },
});

bench({
  name: "native_reduxLens_delete",
  runs: 100,
  func(b): void {
    b.start();

    const state = getStateWithInstances();

    delete state.instances.byId[a2.data.id]

    const result = {
      ...state,
      instances: {
        ...state.instances,
        ids: state.instances.ids.filter((id: string) => id !== a2.data.id),
      },
    };

    b.stop();

    assertReduxLensDelete(result)
  },
});


if (import.meta.main) {
  await runBenchmarks({ silent: true }, prettyBenchmarkProgress())
  // .then(prettyBenchmarkResult());
}

