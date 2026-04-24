import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Pack } from './data';
import { ColumnHeader } from './enums';

const columnHelper = createColumnHelper<Pack>();

export const columns: ColumnDef<Pack, any>[] = [
  columnHelper.accessor('name', {
    header: ColumnHeader.Name,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('numberOfFiles', {
    header: ColumnHeader.NumberOfFiles,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('difficultyRange', {
    header: ColumnHeader.DifficultyRange,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: ColumnHeader.Type,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('stepartists', {
    header: ColumnHeader.Stepartists,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('year', {
    header: ColumnHeader.Year,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('download', {
    header: ColumnHeader.Download,
    cell: info => <a href={info.getValue()} target="_blank" rel="noopener noreferrer">Download</a>,
  }),
];
