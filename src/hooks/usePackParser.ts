import { useCallback } from 'react';
import JSZip from 'jszip';
import { Pack, Song, Difficulty } from '../types';

export interface ParseResult {
  success: boolean;
  pack?: Pack;
  error?: string;
}

type OptionalPackAttrs = {
  difficultyRange?: string;
  type?: string;
  stepartists?: string;
  year?: number;
  download?: string;
};

function parseBpmRange(value: string): string {
  const cleaned = value.replace(/;$/, '').trim();
  const parts = cleaned.split(',').map(part => part.trim()).filter(Boolean);
  const bpms: number[] = [];

  parts.forEach(part => {
    const [, right] = part.split(/=|:/).map(p => p.trim());
    if (!right) return;
    const bpm = parseFloat(right);
    if (!Number.isNaN(bpm)) {
      bpms.push(bpm);
    }
  });

  if (bpms.length === 0) {
    return cleaned;
  }

  const min = Math.min(...bpms);
  const max = Math.max(...bpms);
  const format = (value: number) => (Number.isInteger(value) ? String(value) : String(value));

  return min === max ? format(min) : `${format(min)}-${format(max)}`;
}

async function parseSimFile(content: string, isSsc: boolean): Promise<Song[]> {
  let currentSong: Partial<Song> | null = null;
  let currentDifficulty: Partial<Difficulty> | null = null;
  const difficulties: Difficulty[] = [];

  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    if (isSsc && line.startsWith('#NOTEDATA:')) {
      break;
    } else if (!isSsc && line.startsWith('#NOTES:')) {
      break;
    }

    if (line.startsWith('#')) {
      const match = line.match(/#([A-Z]+):\s*([^;]*);?/);
      if (match) {
        const [, field, value] = match;
        const cleanValue = value.trim();

        if (field === 'TITLE') {
          currentSong = currentSong || {};
          currentSong.title = cleanValue;
        } else if (field === 'ARTIST') {
          currentSong = currentSong || {};
          currentSong.artist = cleanValue;
        } else if (field === 'BPMS') {
          currentSong = currentSong || {};
          currentSong.bpm = parseBpmRange(cleanValue);
        }
      }
    }
    i++;
  }

  if (currentSong && currentSong.title) {
    currentSong.length = currentSong.length || '2:30';
    currentSong.difficulties = [];
  }

  if (isSsc) {
    while (i < lines.length) {
      const line = lines[i].trim();

      if (line.startsWith('#STEPSTYPE:')) {
        const match = line.match(/#STEPSTYPE:\s*([^;]*);?/);
        if (match) {
          currentDifficulty = { type: match[1].trim() };
        }
      } else if (line.startsWith('#DIFFICULTY:')) {
        const match = line.match(/#DIFFICULTY:\s*([^;]*);?/);
        if (match && currentDifficulty) {
          currentDifficulty.difficulty = match[1].trim();
        }
      } else if (line.startsWith('#METER:')) {
        const match = line.match(/#METER:\s*([^;]*);?/);
        if (match && currentDifficulty) {
          currentDifficulty.level = parseInt(match[1]) || 0;
          if (currentSong && currentDifficulty.level && currentDifficulty.type) {
            currentSong.difficulties!.push(currentDifficulty as Difficulty);
          }
          currentDifficulty = null;
        }
      } else if (line.startsWith('#NOTES:')) {
        i++;
        while (i < lines.length && !lines[i].includes(';')) {
          i++;
        }
      }
      i++;
    }
  } else {
    while (i < lines.length) {
      const line = lines[i].trim();

      if (line.startsWith('#NOTES:')) {
        i++;
        let stepsType = '';
        let difficulty = '';
        let level = 0;

        if (i < lines.length) stepsType = lines[i].trim();
        i++;
        if (i < lines.length) i++;
        i++;
        if (i < lines.length) difficulty = lines[i].trim();
        i++;
        if (i < lines.length) level = parseInt(lines[i].trim()) || 0;
        i++;

        if (stepsType && difficulty && level) {
          difficulties.push({
            type: stepsType,
            difficulty: difficulty,
            level: level
          });
        }

        while (i < lines.length && !lines[i].trim().startsWith('#NOTES:')) {
          i++;
        }
        continue;
      }
      i++;
    }

    if (currentSong && currentSong.title) {
      currentSong.difficulties = difficulties;
    }
  }

  if (currentSong && currentSong.title) {
    return [currentSong as Song];
  }

  return [];
}

async function parseZipFile(
  zip: JSZip,
  packName: string,
  optionalAttrs?: OptionalPackAttrs
): Promise<ParseResult> {
  try {
    const allFiles = Object.keys(zip.files);
    const songFolders = new Set<string>();

    allFiles.forEach(file => {
      const parts = file.split('/');
      if (parts.length >= 2 && parts[0] === packName && parts[1]) {
        songFolders.add(parts[1]);
      }
    });

    const songs: Song[] = [];

    for (const songFolder of songFolders) {
      const folderPath = `${packName}/${songFolder}/`;
      const folderFiles = allFiles.filter(f => f.startsWith(folderPath) && f !== folderPath);

      let simFile = folderFiles.find(f => f.endsWith('.ssc'));
      let isSsc = true;

      if (!simFile) {
        simFile = folderFiles.find(f => f.endsWith('.sm'));
        isSsc = false;
      }

      if (!simFile) {
        continue;
      }

      try {
        const fileContent = await zip.file(simFile)!.async('text');
        const parsedSongs = await parseSimFile(fileContent, isSsc);
        songs.push(...parsedSongs);
      } catch (error) {
        console.error(`Error parsing ${simFile}:`, error);
      }
    }

    const pack: Pack = {
      name: packName,
      numberOfFiles: songs.length,
      year: optionalAttrs?.year || 2026,
      songs: songs,
      ...(optionalAttrs?.difficultyRange && { difficultyRange: optionalAttrs.difficultyRange }),
      ...(optionalAttrs?.type && { type: optionalAttrs.type }),
      ...(optionalAttrs?.stepartists && { stepartists: optionalAttrs.stepartists }),
      ...(optionalAttrs?.download && { download: optionalAttrs.download })
    };

    return { success: true, pack };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export function usePackParser() {
  const parsePackZip = useCallback(
    async (file: File, optionalAttrs?: OptionalPackAttrs): Promise<ParseResult> => {
      try {
        const zip = await JSZip.loadAsync(file);
        const entries = Object.keys(zip.files);

        const rootFolders = new Set(
          entries
            .filter(e => e.includes('/') && !e.endsWith('/'))
            .map(e => e.split('/')[0])
        );

        if (rootFolders.size !== 1) {
          return { success: false, error: 'Invalid zip structure: Expected exactly one root folder.' };
        }

        const packName = Array.from(rootFolders)[0];
        return await parseZipFile(zip, packName, optionalAttrs);
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    []
  );

  return { parsePackZip };
}
