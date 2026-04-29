import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';

export default function UploadData() {
  const [info, setInfo] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const zip = await JSZip.loadAsync(file);
      const entries = Object.keys(zip.files);

      // Find root folders (folders at the top level)
      const rootFolders = entries
        .filter(e => e.includes('/') && !e.split('/').slice(1).some(part => part)) // Only top-level folders
        .map(e => e.split('/')[0])
        .filter((v, i, a) => a.indexOf(v) === i);

      if (rootFolders.length !== 1) {
        setInfo('Invalid zip structure: Expected exactly one root folder.');
        return;
      }

      const parentFolder = rootFolders[0];

      // Count subfolders directly inside the parent folder
      const subFolders = entries
        .filter(e => e.startsWith(parentFolder + '/') && e !== parentFolder + '/' && e.endsWith('/'))
        .map(e => e.split('/').slice(0, 2).join('/')) // Get parent/subfolder
        .filter((v, i, a) => a.indexOf(v) === i)
        .filter(e => e.split('/').length === 2); // Only direct subfolders

      const count = subFolders.length;

      setInfo(`Parent folder: ${parentFolder}, Number of subfolders: ${count}`);
    } catch (error) {
      setInfo('Error processing zip file.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/zip': ['.zip'] }
  });

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h2>Upload Data</h2>
        <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
          <input {...getInputProps()} />
          {isDragActive ? <p>Drop the zip file here...</p> : <p>Drag 'n' drop a zip file here, or click to select one</p>}
        </div>
        {info && <p style={{ marginTop: '10px' }}>{info}</p>}
      </div>
    </div>
  );
}
