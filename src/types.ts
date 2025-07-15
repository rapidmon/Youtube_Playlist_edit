// types.ts (선택)
export interface Video {
  videoId: string;
  title: string;
  url: string;
  uploader: string;
  thumbnail: string;
}

export interface State {
  videos: Video[];
}

export type Action =
  | { type: 'SET_VIDEOS'; payload: Video[] }
  | { type: 'ADD_VIDEO'; payload: Video }
  | { type: 'REMOVE_VIDEO'; payload: string }
  | { type: 'REORDER_VIDEOS'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'SORT_BY_TITLE_ASC' }
  | { type: 'SORT_BY_TITLE_DESC' }
  | { type: 'SORT_BY_ARTIST_ASC' }
  | { type: 'SORT_BY_ARTIST_DESC' }
  | { type: 'SHUFFLE' }
  | { type: 'REMOVE_DUPLICATES' };