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
import {
  array100,
  array10K,
  getProperty,
  isOdd,
  lessThanThreeDigits,
  square,
} from "../utils.ts";

const assocCounter = (data: number[]) => data.map((i) => ({ counter: i }));
const getCounter = getProperty("counter");

const assertResult = (length: number, expected: number[]) =>
  (result: number[]) => {
    assertEquals(result.length, length);
    assertEquals(result, expected);
  };

const assertLessThanThreeDigits = assertResult(5, [1, 9, 25, 49, 81]);

bench({
  name: "lodash_lessThanThreeDigits_100",
  runs: 100,
  func(b): void {
    const data = assocCounter(array100());
    b.start();
    const result = lodash.chain(data)
      .map(getCounter)
      .filter(isOdd)
      .map(square)
      .filter(lessThanThreeDigits)
      .value();
    b.stop();

    assertLessThanThreeDigits(result);
  },
});

bench({
  name: "ramda_lessThanThreeDigits_100",
  runs: 100,
  func(b): void {
    const data = assocCounter(array100());
    b.start();
    const result = R.pipe(
      R.map(R.prop("counter")),
      R.filter(isOdd),
      R.map(square),
      R.filter(lessThanThreeDigits),
    )(data);
    b.stop();

    assertLessThanThreeDigits(result);
  },
});

bench({
  name: "native_lessThanThreeDigits_100",
  runs: 100,
  func(b): void {
    const data = assocCounter(array100());
    b.start();
    const result = data
      .map(getCounter)
      .filter(isOdd)
      .map(square)
      .filter(lessThanThreeDigits);
    b.stop();

    assertLessThanThreeDigits(result);
  },
});

bench({
  name: "lodash_lessThanThreeDigits_10K",
  runs: 100,
  func(b): void {
    const data = assocCounter(array10K());
    b.start();
    const result = lodash.chain(data)
      .map(getCounter)
      .filter(isOdd)
      .map(square)
      .filter(lessThanThreeDigits)
      .value();
    b.stop();

    assertLessThanThreeDigits(result);
  },
});

bench({
  name: "ramda_lessThanThreeDigits_10K",
  runs: 100,
  func(b): void {
    const data = assocCounter(array10K());
    b.start();
    const result = R.pipe(
      R.pluck("counter"),
      R.filter(isOdd),
      R.map(square),
      R.filter(lessThanThreeDigits),
    )(data);
    b.stop();

    assertLessThanThreeDigits(result);
  },
});


bench({
  name: "native_lessThanThreeDigits_10K",
  runs: 100,
  func(b): void {
    const data = assocCounter(array10K());
    b.start();
    const result = data
      .map(getCounter)
      .filter(isOdd)
      .map(square)
      .filter(lessThanThreeDigits);
    b.stop();

    assertLessThanThreeDigits(result);
  },
});

bench({
  name: "ramda_transducer_lessThanThreeDigits_10K",
  runs: 100,
  func(b): void {
    const data = assocCounter(array10K());
    b.start();
    const transducer = R.compose(
      R.pluck("counter"),
      R.filter(isOdd),
      R.map(square),
      R.filter(lessThanThreeDigits),
    );
    const result = R.into([], transducer, data);
    b.stop();

    assertLessThanThreeDigits(result);
  },
});

if (import.meta.main) {
  await runBenchmarks({ silent: true }, prettyBenchmarkProgress())
  // .then(prettyBenchmarkResult());
}
