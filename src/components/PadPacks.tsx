import { useReactTable, flexRender } from '@tanstack/react-table';
import { Pack } from '../data';

export interface PadPacksProps {
  selectedYear: number;
  selectedPack: Pack | null;
  globalFilter: string;
  table: ReturnType<typeof useReactTable>;
  onSelectYear: (year: number) => void;
  onSetGlobalFilter: (value: string) => void;
  onRowClick: (pack: Pack) => void;
}

export default function PadPacks({
  selectedYear,
  selectedPack,
  globalFilter,
  table,
  onSelectYear,
  onSetGlobalFilter,
  onRowClick,
}: PadPacksProps) {
  return (
    <>
      <div className="btn-group mb-3" role="group">
        <button
          onClick={() => onSelectYear(2025)}
          className={`btn btn-outline-secondary ${selectedYear === 2025 ? 'active' : ''}`}
          type="button"
        >
          2025
        </button>
        <button
          onClick={() => onSelectYear(2026)}
          className={`btn btn-outline-secondary ${selectedYear === 2026 ? 'active' : ''}`}
          type="button"
        >
          2026
        </button>
      </div>
      <input
        type="text"
        placeholder="Search packs..."
        value={globalFilter}
        onChange={(e) => onSetGlobalFilter(e.target.value)}
        className="form-control mb-3"
      />
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                onClick={() => onRowClick(row.original)}
                className={selectedPack?.name === row.original.name ? 'selected' : ''}
                style={{ cursor: 'pointer' }}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPack && (
        <div className="card pack-details mt-4">
          <div className="card-body">
            <h2 className="card-title">{selectedPack.name} - Songs</h2>
            <div>
              {selectedPack.songs.map((song, index) => (
                <div key={index} className="card song-item mb-3">
                  <div className="card-body">
                    <h3>{song.title} by {song.artist}</h3>
                    {song.bpm && <p className="mb-1">BPM: {song.bpm}</p>}
                    {song.length && <p className="mb-1">Length: {song.length}</p>}
                    <h4>Difficulties:</h4>
                    <ul className="difficulties-list list-group list-group-flush">
                      {song.difficulties.map((diff, diffIndex) => (
                        <li key={diffIndex} className="list-group-item">
                          Level {diff.level} {diff.type}
                          {diff.steps && ` - ${diff.steps} steps`}
                          {diff.freezes && `, ${diff.freezes} freezes`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
