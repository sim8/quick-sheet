export type Functions = 'SUM' | 'AVG'

export type Cell = [string, string]

export type FunctionInput = {
    function: Function
    inputCells: Cell[]
}

export type CellInput = string | number | boolean | FunctionInput