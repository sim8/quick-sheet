import { memo, type KeyboardEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { useSheet } from './hooks/useSheet';
import type { CellInput } from './types';
import './styles.css';

// functions
// - Equals (cell)
// - Sum (cell1, cell2 ...)

const ROWS = 100;
const COLUMNS = 100;

function columnLabel(index: number): string {
  let label = '';
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) {
    label = String.fromCharCode(65 + ((n - 1) % 26)) + label;
  }
  return label;
}

const columns = Array.from({ length: COLUMNS }, (_, index) =>
  columnLabel(index),
);

const Cell = memo(function Cell({
  row,
  column,
  input,
  onChange,
}: {
  row: number;
  column: number;
  input: CellInput | undefined;
  onChange: (cellKey: string, input: CellInput) => void;
}) {
  const value = typeof input === 'object' ? 'FUNCTION' : String(input ?? '');
  const address = `${columns[column]}${row + 1}`;

  function navigate(event: KeyboardEvent<HTMLInputElement>) {
    // Arrow keys stay available for editing text inside the cell.
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const nextRow = row + (event.shiftKey ? -1 : 1);
    if (nextRow >= 0 && nextRow < ROWS) {
      document.getElementById(`${columns[column]}${nextRow + 1}`)?.focus();
    }
  }

  return (
    <td>
      <input
        id={address}
        aria-label={address}
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(address, event.target.value)}
        onKeyDown={navigate}
      />
    </td>
  );
});

function App() {
  const { sheetInputs, setCellInput } = useSheet();

  return (
    <main className="spreadsheet">
      <section
        className="grid-scroll"
        aria-label="Editable spreadsheet"
        tabIndex={-1}
      >
        <table aria-label="Sheet 1">
          <colgroup>
            <col className="row-number-column" />
            {columns.map((label) => (
              <col key={label} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="corner" aria-label="Row numbers">
                <span />
              </th>
              {columns.map((label) => (
                <th key={label} scope="col">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS }, (_, row) => (
              <tr key={row}>
                <th scope="row">{row + 1}</th>
                {columns.map((label, column) => (
                  <Cell
                    key={label}
                    row={row}
                    column={column}
                    input={sheetInputs[`${label}${row + 1}`]}
                    onChange={setCellInput}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="sheet-footer">
        <span className="all-sheets" aria-hidden="true">
          ☰
        </span>
        <div className="sheet-tab">
          <span className="tab-icon" aria-hidden="true">
            ▦
          </span>{' '}
          Sheet 1
        </div>
        <span className="footer-note">Changes stay in this session</span>
        <span className="zoom">100%</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
