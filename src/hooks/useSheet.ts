import { useCallback, useState } from 'react';
import { CellInput, CellValue, FunctionInput } from '../types';
import { parseFunction } from '../parseFunction';
import { functions } from '../functions';

function isFunctionInput(input: CellInput): input is FunctionInput {
    return typeof input === 'object' && input !== null
}

type Sheet = {
    inputs: Record<string, CellInput>,
    dependencies: Record<string, Set<string>>,
    computedValues: Record<string, CellValue>
}

export function useSheet() {
    const [sheet, setSheet] = useState<Sheet>({
        inputs: { 'A2': 'Hello World' },
        dependencies: {},
        computedValues: {}
    });

    const setCellInput = useCallback(
        (cellKey: string, cellInput: CellInput) => {
            setSheet(({ inputs, dependencies, computedValues }) => {
                const nextInputs = { ...inputs }
                const nextDependencies = { ...dependencies }
                const nextComputedValues = { ...computedValues }


                function computeNode(cellKey: string) {
                    const input = nextInputs[cellKey]
                    console.log({ input })
                    if (!isFunctionInput(input)) {
                        return;
                    }
                    const inputValues = input.inputCellKeys.map(inputCellKey => isFunctionInput(nextInputs[inputCellKey]) ? nextComputedValues[inputCellKey] : nextInputs[inputCellKey])
                    console.log({ inputValues })

                    let computedValue;
                    if (inputValues.every(i => typeof i === 'number')) {
                        computedValue = functions[input.functionName](...inputValues)
                    } else {
                        computedValue = NaN
                    }
                    console.log({ computedValue, prevComputedValue: computedValues[cellKey] })
                    if (computedValue === computedValues[cellKey]) {
                        return
                    }
                    nextComputedValues[cellKey] = computedValue;
                    nextDependencies[cellKey]?.forEach(computeNode)
                }

                if (cellInput === '') {
                    delete nextInputs[cellKey]
                    delete nextComputedValues[cellKey]
                    const prevDependencies = isFunctionInput(inputs[cellKey]) ? inputs[cellKey].inputCellKeys : []
                    prevDependencies.forEach(prevDependencyCellKey => {
                        nextDependencies[prevDependencyCellKey].delete(cellKey)
                        if (nextDependencies[prevDependencyCellKey].size === 0) {
                            delete nextDependencies[prevDependencyCellKey]
                        }
                    })
                } else {
                    nextInputs[cellKey] = cellInput;
                    if (isFunctionInput(cellInput)) {
                        cellInput.inputCellKeys.forEach(dependencyCellKey => {
                            nextDependencies[dependencyCellKey] = nextDependencies[dependencyCellKey] || new Set()
                            nextDependencies[dependencyCellKey].add(cellKey)
                        })
                        computeNode(cellKey)
                    } else {
                        delete nextComputedValues[cellKey]
                        nextDependencies[cellKey]?.forEach(computeNode)
                    }
                }
                // TODO recursively update dependencies
                // base case - computedValue unchanged or not more dependents
                console.log({
                    inputs: nextInputs,
                    dependencies: nextDependencies,
                    computedValues: nextComputedValues
                })
                return {
                    inputs: nextInputs,
                    dependencies: nextDependencies,
                    computedValues: nextComputedValues
                };
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

    return { sheetInputs: sheet.inputs, computedValues: sheet.computedValues, onCellChange };
}
