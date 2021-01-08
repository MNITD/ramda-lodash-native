export const array100 = () => [...Array(100).keys()];
export const array10K = () => [...Array(10_000).keys()];

export const isOdd  = (num: number) => num % 2 === 1;
export const square = (num: number) => num * num;
export const lessThanThreeDigits = (num: number) => num.toString().length < 3;
export const getProperty = (property: string) => (item: Record<string, number>) => item[property]
export const double = (n: number) =>  n * 2;
export const add4 = (n: number) => n + 4;
