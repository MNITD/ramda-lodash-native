## Prerequisites

Install Deno using [instructions](https://deno.land/manual/getting_started/installation) or for Mac `brew install deno`

Download `lodash-npm` archive from [GitHub](https://github.com/lodash/lodash/archive/npm.zip) and unzip it as `lodash-npm` folder in the project top level directory. 

## Running

To run all benching execute `index.ts` in `benching` folder
```
 deno --unstable run --allow-read --allow-env --allow-hrtime benching/index.ts
```

Or you can run exact benching

```
 deno --unstable run --allow-read --allow-env --allow-hrtime benching/lessThanThreeDigits.ts
```
