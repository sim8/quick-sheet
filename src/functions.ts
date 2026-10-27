import { FunctionName } from "./types";

export const functions: Record<FunctionName, (...inputs: number[]) => number> = {
    SUM: (...nums: number[]) => nums.reduce((acc, i) => acc + i, 0),
    AVG: (...nums: number[]) => nums.reduce((acc, i) => acc + i, 0) / nums.length,
    // max
    // avg
};

