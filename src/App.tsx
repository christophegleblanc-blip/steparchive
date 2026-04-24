import { useReactTable, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import './style.css';
import { Pack } from './data';
import { Tab } from './enums';
import { columns } from './tableColumns';
import PadPacks from './components/PadPacks';
import UploadData from './components/UploadData';

function App() {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [packsData, setPacksData] = useState<Pack[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PadPacks);

  useEffect(() => {
    const loadData = async () => {
      const data = await import(`./data/${selectedYear}.json`);
      setPacksData(data.default);
      setSelectedPack(null); // Reset selection when year changes
    };
    loadData();
  }, [selectedYear]);

  const table = useReactTable({
    data: packsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleRowClick = (pack: Pack) => {
    setSelectedPack(selectedPack?.name === pack.name ? null : pack);
  };

  const selectYear = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <div className="app-container">
      <h1>Stepmania Pack Archive</h1>
      <div className="nav nav-tabs mb-4">
        <button
          onClick={() => setActiveTab(Tab.PadPacks)}
          className={`nav-link ${activeTab === Tab.PadPacks ? 'active' : ''}`}
          type="button"
        >
          Pad Packs
        </button>
        <button
          onClick={() => setActiveTab(Tab.UploadData)}
          className={`nav-link ${activeTab === Tab.UploadData ? 'active' : ''}`}
          type="button"
        >
          Upload Data
        </button>
      </div>

      {activeTab === Tab.PadPacks ? (
        <PadPacks
          selectedYear={selectedYear}
          selectedPack={selectedPack}
          globalFilter={globalFilter}
          table={table}
          onSelectYear={selectYear}
          onSetGlobalFilter={setGlobalFilter}
          onRowClick={handleRowClick}
        />
      ) : (
        <UploadData />
      )}
    </div>
  );
}

export default App;