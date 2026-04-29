export interface Difficulty {
  level: number;
  type: string; // e.g., 'Single', 'Double', 'Half-Double'
  difficulty?: string; // e.g., 'Beginner', 'Basic', 'Difficult', 'Expert', 'Challenge'
}

export interface Song {
  title: string;
  artist: string;
  bpm?: number;
  length?: string; // e.g., '2:30'
  difficulties: Difficulty[];
}

export interface Pack {
  name: string;
  numberOfFiles: number;
  difficultyRange?: string;
  type?: string;
  stepartists?: string;
  download?: string;
  year: number;
  songs: Song[];
}