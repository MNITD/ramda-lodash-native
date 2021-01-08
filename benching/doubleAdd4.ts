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

import lodash from "../lodash.ts";
import { add4, array100, array10K, double } from "../utils.ts";

const assertResult = (length: number, first10: number[]) =>
  (result: number[]) => {
    assertEquals(result.length, length);
    assertEquals(result.slice(0, 10), first10);
  };

const assertDoubleAdd4 = assertResult(
  100,
  [4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
);
const assertDoubleAdd4_10K = assertResult(
  10_000,
  [4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
);

bench({
  name: "lodash_doubleAdd4_100",
  runs: 100,
  func(b): void {
    const data = array100();
    b.start();
    const result = lodash.chain(data)
      .map(double)
      .map(add4)
      .value();
    b.stop();

    assertDoubleAdd4(result);
  },
});

bench({
  name: "ramda_doubleAdd4_100",
  runs: 100,
  func(b): void {
    const data = array100();
    b.start();
    const result = R.pipe(
      R.map(double),
      R.map(add4),
    )(data);
    b.stop();

    assertDoubleAdd4(result);
  },
});

bench({
  name: "native_doubleAdd4_100",
  runs: 100,
  func(b): void {
    const data = array100();
    b.start();
    const result = data.map(double).map(add4);
    b.stop();

    assertDoubleAdd4(result);
  },
});

bench({
  name: "lodash_doubleAdd4_10K",
  runs: 100,
  func(b): void {
    const data = array10K();
    b.start();
    const result = lodash.chain(data)
      .map(double)
      .map(add4)
      .value();
    b.stop();

    assertDoubleAdd4_10K(result);
  },
});

bench({
  name: "ramda_pipe_doubleAdd4_10K",
  runs: 100,
  func(b): void {
    const data = array10K();
    b.start();
    const result = R.pipe(
      R.map(double),
      R.map(add4),
    )(data);
    b.stop();

    assertDoubleAdd4_10K(result);
  },
});

bench({
  name: "native_doubleAdd4_10K",
  runs: 100,
  func(b): void {
    const data = array10K();
    b.start();
    const result = data.map(double).map(add4);
    b.stop();

    assertDoubleAdd4_10K(result);
  },
});

bench({
  name: "ramda_map_doubleAdd4_10K",
  runs: 100,
  func(b): void {
    const data = array10K();
    b.start();
    const result = R.map(R.pipe(double, add4), data)
    b.stop();

    assertDoubleAdd4_10K(result);
  },
});

bench({
  name: "ramda_transducer_doubleAdd4_10K",
  runs: 100,
  func(b): void {
    const data = array10K();
    b.start();
    const transducer = R.compose(
      R.map(double),
      R.map(add4),
    );
    const result = R.into([], transducer, data);
    b.stop();

    assertDoubleAdd4_10K(result);
  },
});


if (import.meta.main) {
  await runBenchmarks({ silent: true }, prettyBenchmarkProgress())
  // .then(prettyBenchmarkResult());
}
