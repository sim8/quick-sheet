import { useCallback, useState } from 'react';
import { CellInput } from '../types';

type SheetInputs = Record<string, Record<string, CellInput>>;


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
        A: {
            '2': 'Hello World',
        },
    });

    const setCellInput = useCallback(
        (column: string, row: string, cellInput: CellInput) => {
            if (cellInput === '') {
                setSheetInputs((sheetInputs) => {
                    if (!Object.hasOwn(sheetInputs[column] ?? {}, row)) {
                        return sheetInputs;
                    }

                    const nextColumn = { ...sheetInputs[column] };
                    delete nextColumn[row];

                    const nextSheetInputs = { ...sheetInputs };
                    if (Object.keys(nextColumn).length === 0) {
                        delete nextSheetInputs[column];
                    } else {
                        nextSheetInputs[column] = nextColumn;
                    }

                    return nextSheetInputs;
                });
                return;
            }
            setSheetInputs((sheetInputs) => ({
                ...sheetInputs,
                [column]: {
                    ...sheetInputs[column],
                    [row]: cellInput,
                },
            }));
        },
        [],
    );

    return { sheetInputs, setCellInput };
}
