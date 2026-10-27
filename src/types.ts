export type Functions = 'SUM' | 'AVG'

export type Cell = [string, string]

export type FunctionInput = {
    function: Functions
    inputCells: Cell[]
}

export type CellInput = string | number | boolean | FunctionInput
