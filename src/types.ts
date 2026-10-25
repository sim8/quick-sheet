export type Functions = 'EQUALS' | 'SUM'

export type Cell = [string, string]

export type FunctionInput = {
    function: Function
    inputCells: Cell[]
}

export type CellInput = string | number | boolean | FunctionInput