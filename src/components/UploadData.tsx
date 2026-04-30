import { useCallback, useState, CSSProperties } from 'react';
import { useDropzone } from 'react-dropzone';
import { Pack } from '../types';
import { usePackParser } from '../hooks/usePackParser';
import { usePackForm } from '../hooks/usePackForm';

export default function UploadData() {
  const [info, setInfo] = useState('');
  const [pack, setPack] = useState<Pack | null>(null);
  const { parsePackZip } = usePackParser();
  const { fields, updateField, optionalAttrs } = usePackForm();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setInfo('Processing...');
      setPack(null);

      const result = await parsePackZip(file, optionalAttrs);

      if (result.success && result.pack) {
        setPack(result.pack);
        setInfo(`✓ Pack "${result.pack.name}" parsed successfully. ${result.pack.songs.length} songs found.`);
      } else {
        setInfo(`✗ Error: ${result.error}`);
      }
    },
    [optionalAttrs, parsePackZip]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/zip': ['.zip'] }
  });

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box'
  };

  const labelStyle: CSSProperties = {
    display: 'block',
    marginBottom: '4px',
    fontWeight: 'bold',
    fontSize: '14px'
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h2>Upload Data</h2>

        {/* Optional attributes section */}
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
          <h4 style={{ marginTop: 0 }}>Optional Pack Information</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Difficulty Range</label>
              <input
                type="text"
                value={fields.difficultyRange}
                onChange={(e) => updateField('difficultyRange', e.target.value)}
                placeholder="e.g., Medium-Hard"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <input
                type="text"
                value={fields.type}
                onChange={(e) => updateField('type', e.target.value)}
                placeholder="e.g., Remix, Original"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Stepartists</label>
              <input
                type="text"
                value={fields.stepartists}
                onChange={(e) => updateField('stepartists', e.target.value)}
                placeholder="e.g., Artist1, Artist2"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <input
                type="number"
                value={fields.year}
                onChange={(e) => updateField('year', e.target.value)}
                placeholder="2026"
                style={inputStyle}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Download Link</label>
              <input
                type="text"
                value={fields.download}
                onChange={(e) => updateField('download', e.target.value)}
                placeholder="e.g., https://example.com/download"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Dropzone */}
        <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
          <input {...getInputProps()} />
          {isDragActive ? <p>Drop the zip file here...</p> : <p>Drag 'n' drop a zip file here, or click to select one</p>}
        </div>
        {info && (
          <p style={{ marginTop: '10px', fontWeight: info.startsWith('✓') ? 'normal' : 'bold', color: info.startsWith('✓') ? 'green' : 'red' }}>
            {info}
          </p>
        )}
        {pack && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <h3>{pack.name}</h3>
            <p><strong>Songs:</strong> {pack.numberOfFiles}</p>
            <p><strong>Year:</strong> {pack.year}</p>
            {pack.difficultyRange && <p><strong>Difficulty Range:</strong> {pack.difficultyRange}</p>}
            {pack.type && <p><strong>Type:</strong> {pack.type}</p>}
            {pack.stepartists && <p><strong>Stepartists:</strong> {pack.stepartists}</p>}
            {pack.download && <p><strong>Download:</strong> <a href={pack.download} target="_blank" rel="noopener noreferrer">{pack.download}</a></p>}
            {pack.songs.length > 0 && (
              <div>
                <h4>Songs Details:</h4>
                {pack.songs.map((song, idx) => (
                  <div key={idx} style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#fff', borderRadius: '3px' }}>
                    <p><strong>{song.title}</strong> by {song.artist}</p>
                    <p>BPM: {song.bpm || 'N/A'} | Length: {song.length}</p>
                    <p>Difficulties: {song.difficulties.length}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                const dataStr = JSON.stringify(pack, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${pack.name}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Download Parsed Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
