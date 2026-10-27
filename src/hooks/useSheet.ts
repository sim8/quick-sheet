import { useCallback, useState } from 'react';
import { CellInput } from '../types';
import { parseFunction } from '../parseFunction';

type SheetInputs = Record<string, CellInput>;


// Dependent cells. Two entrypoints
// 1. Set cell to function. Compute from upstream
// 2. Set cell to any value and has dependents - compute downstream
// recursively:
// Has value changed? 

const dependencies = {
    // [cellKey]: {
    // subscribers: // set
    //}
}

// const computedValues = // map

export function useSheet() {
    const [sheetInputs, setSheetInputs] = useState<SheetInputs>({
        'A2': 'Hello World',
    });

    const setCellInput = useCallback(
        (cellKey: string, cellInput: CellInput) => {
            setSheetInputs((sheetInputs) => {
                const nextSheetInputs = { ...sheetInputs }
                if (cellInput === '') {
                    delete nextSheetInputs[cellKey]
                } else {
                    nextSheetInputs[cellKey] = cellInput;
                }
                return nextSheetInputs;
            })
        },
        [],
    );

    const onCellChange = useCallback(
        (cellKey: string, value: string) => {
            let input: CellInput = value;
            const parsedFunction = parseFunction(value)

            if (value.toUpperCase() === 'TRUE') {
                input = true;
            } else if (value.toUpperCase() === 'FALSE') {
                input = false;
            } else if (!Number.isNaN(parseInt(value))) {
                input = parseInt(value);
            } else if (parsedFunction) {
                input = parsedFunction
            }
            setCellInput(cellKey, input)
        }
        , [])

    return { sheetInputs, onCellChange };
}
