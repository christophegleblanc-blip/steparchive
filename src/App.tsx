import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender, createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import './style.css';
import { Pack, packsData } from './data';

const columnHelper = createColumnHelper<Pack>();

const columns: ColumnDef<Pack, any>[] = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('numberOfFiles', {
    header: 'Number of Files',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('difficultyRange', {
    header: 'Difficulty Range',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('stepartists', {
    header: 'Stepartist(s)',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('download', {
    header: 'Download',
    cell: info => <a href={info.getValue()} target="_blank" rel="noopener noreferrer">Download</a>,
  }),
];

function App() {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  const table = useReactTable({
    data: packsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (pack: Pack) => {
    setSelectedPack(selectedPack?.name === pack.name ? null : pack);
  };

  return (
    <div>
      <h1>Step Archive Packs</h1>
      <table>
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
              onClick={() => handleRowClick(row.original)}
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

      {selectedPack && (
        <div className="pack-details">
          <h2>{selectedPack.name} - Songs</h2>
          <div>
            {selectedPack.songs.map((song, index) => (
              <div key={index} className="song-item">
                <h3>{song.title} by {song.artist}</h3>
                {song.bpm && <p>BPM: {song.bpm}</p>}
                {song.length && <p>Length: {song.length}</p>}
                <h4>Difficulties:</h4>
                <ul className="difficulties-list">
                  {song.difficulties.map((diff, diffIndex) => (
                    <li key={diffIndex}>
                      Level {diff.level} {diff.type}
                      {diff.steps && ` - ${diff.steps} steps`}
                      {diff.freezes && `, ${diff.freezes} freezes`}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;