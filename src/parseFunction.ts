import functions from './functions';
import type { Cell, FunctionInput, Functions } from './types';

// A formula is a single call containing only comma-separated cell references.
const formulaPattern =
  /^\s*=\s*([A-Z]+)\s*\(\s*((?:[A-Z]+[1-9]\d*(?:\s*,\s*[A-Z]+[1-9]\d*)*)?)\s*\)\s*$/i;

export function parseFunction(value: string): FunctionInput | null {
  const match = formulaPattern.exec(value);
  if (!match) return null;

  const functionName = match[1].toUpperCase();
  if (!Object.hasOwn(functions, functionName)) return null;

  const inputCells: Cell[] = match[2]
    ? match[2].split(',').map((reference) => {
        const [, column, row] = /^([A-Z]+)([1-9]\d*)$/i.exec(reference.trim())!;
        return [column.toUpperCase(), row];
      })
    : [];

  return { function: functionName as Functions, inputCells };
}
