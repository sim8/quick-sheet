export type FunctionName = 'SUM' | 'AVG'

export type FunctionInput = {
    functionName: FunctionName
    inputCellKeys: string[]
}

export type CellValue = string | number | boolean;

export type CellInput = CellValue | FunctionInput
