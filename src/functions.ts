import { Functions } from "./types";

const functions: Record<Functions, (...inputs: number[]) => number> = {
    SUM: (...nums: number[]) => nums.reduce((acc, i) => acc + i, 0),
    AVG: (...nums: number[]) => nums.reduce((acc, i) => acc + i, 0) / nums.length,
    // max
    // avg
};

export default functions;
