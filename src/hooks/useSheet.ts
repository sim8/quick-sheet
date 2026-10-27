import { useCallback, useState } from 'react';
import { CellInput } from '../types';

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

    return { sheetInputs, setCellInput };
}
