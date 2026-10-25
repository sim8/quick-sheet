import { Functions } from "./types";

const functions: Record<Functions, (...inputs: number[]) => number> = {
    EQUALS: (num: number) => num,
    SUM: (...nums: number[]) => nums.reduce((acc, i) => acc + i, 0),
    // max
    // avg
};

export default functions;
