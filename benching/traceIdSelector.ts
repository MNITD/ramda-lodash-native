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
  id: string;
  updated_at: string;
}

const pickFromLogs = (props: string[]) => (state: any) => props.reduce((acc: Record<string, Record<string, any>>, prop) => {
  acc[prop] = state.logs[prop]
  return acc
}, {})

const isDateBeforeDate = (beforeThatDate: string) => (date: string = '') => new Date(date) < new Date(beforeThatDate)
const nowBeforeDate = (date: string = '') => new Date() < new Date(date)

const state = {
  logs: {
    logs: [
      {
        routes: {
          data: [{
            attributes: {
              route_id: '0',
              trace_id: ''
            }
          }]
        },
        occurred_at: '2021-01-07',
        expired_at: '2022-01-07'
      },
      {
        routes: {
          data: [{
            attributes: {
              route_id: '1',
              trace_id: ''
            }
          }]
        },
        occurred_at: '2021-01-07',
        expired_at: '2022-01-07'
      },
      {
        routes: {
          data: [{
            attributes: {
              route_id: '2',
              trace_id: ''
            }
          }]
        },
        occurred_at: '2021-01-07',
        expired_at: '2022-01-07'
      },
      {
        routes: {
          data: [{
            attributes: {
              route_id: '3',
              trace_id: ''
            }
          }]
        },
        occurred_at: '2021-01-07',
        expired_at: '2022-01-07'
      },
      {
        routes: {
          data: [{
            attributes: {
              route_id: '4',
              trace_id: 'traceId'
            }
          }]
        },
        occurred_at: '2021-01-07',
        expired_at: '2022-01-07'
      },
    ]
  }
}
const route = {
  id: '4',
  updated_at: '2021-01-08',
}

const assertTraceId = (result?: Route) => assertEquals(result, state.logs.logs[4].routes.data[0].attributes.trace_id)

bench({
  name: "ramda_traceIdSelector",
  runs: 100,
  func(b): void {
    b.start();

    const logPredicate = (route?: Route) => R.allPass([
      R.pathEq(['routes', 'data', '0', 'attributes', 'route_id'], route?.id),
      R.propSatisfies(isDateBeforeDate(route?.updated_at as string), 'occurred_at'),
      R.propSatisfies(nowBeforeDate, 'expired_at'),
    ]);

    const traceIdSelector = (route?: Route) => R.pipe(
      pickFromLogs(['logs']),
      R.prop('logs'),
      R.find(logPredicate(route)),
      R.path(['routes', 'data', '0', 'attributes', 'trace_id']),
    );

    const result = traceIdSelector(route)(state)

    b.stop();

    assertTraceId(result)
  },
});

bench({
  name: "native_filterGuideRoute",
  runs: 100,
  func(b): void {
    b.start();

    const logPredicate = (route?: Route) => (item: typeof state.logs.logs[0]) =>
      item?.routes?.data?.[0]?.attributes?.route_id === route?.id &&
      isDateBeforeDate(route?.updated_at as string)(item?.occurred_at) &&
      nowBeforeDate(item.expired_at);

    const traceIdSelector = (route?: Route) => (state: any) => {
      const {logs} = pickFromLogs(['logs'])(state);
      const foundRoute = logs.find(logPredicate(route))
      return foundRoute?.routes?.data?.[0]?.attributes?.trace_id
    }
    const result = traceIdSelector(route)(state)

    b.stop();

    assertTraceId(result)
  },
});


if (import.meta.main) {
  await runBenchmarks({ silent: true }, prettyBenchmarkProgress())
  // .then(prettyBenchmarkResult());
}
