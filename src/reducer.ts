// reducer.ts
import { State, Action } from './types';

export const initialState: State = { videos: [] };

// 셔플 함수
const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// 문자열 정렬 함수 (한글 지원)
const sortByString = (a: string, b: string, ascending = true): number => {
    const comparison = a.localeCompare(b, 'ko', { 
        numeric: true, 
        sensitivity: 'base' 
    });
    return ascending ? comparison : -comparison;
};

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_VIDEOS':
        return { ...state, videos: action.payload };

        case 'ADD_VIDEO':
        return { ...state, videos: [...state.videos, action.payload] };

        case 'REMOVE_VIDEO':
        return {
            ...state,
            videos: state.videos.filter(v => v.videoId !== action.payload),
        };

        case 'REORDER_VIDEOS': {
            const { oldIndex, newIndex } = action.payload;
            const newVideos = [...state.videos];
            const [removed] = newVideos.splice(oldIndex, 1);
            newVideos.splice(newIndex, 0, removed);
            
            return {
                ...state,
                videos: newVideos
            };
        };
        
        case 'SORT_BY_TITLE_ASC':
            return {
                ...state,
                videos: [...state.videos].sort((a, b) => 
                    sortByString(a.title, b.title, true)
                )
            };
            
        case 'SORT_BY_TITLE_DESC':
            return {
                ...state,
                videos: [...state.videos].sort((a, b) => 
                    sortByString(a.title, b.title, false)
                )
            };
            
        case 'SORT_BY_ARTIST_ASC':
            return {
                ...state,
                videos: [...state.videos].sort((a, b) => 
                    sortByString(a.uploader, b.uploader, true)
                )
            };
            
        case 'SORT_BY_ARTIST_DESC':
            return {
                ...state,
                videos: [...state.videos].sort((a, b) => 
                    sortByString(a.uploader, b.uploader, false)
                )
            };
            
        case 'SHUFFLE':
            return {
                ...state,
                videos: shuffleArray(state.videos)
            };
            
        case 'REMOVE_DUPLICATES': {
            // 제목을 기준으로 중복 제거 (대소문자 무시, 공백 정리)
            const seen = new Set<string>();
            const uniqueVideos = state.videos.filter(video => {
                const normalizedTitle = video.title.toLowerCase().trim();
                if (seen.has(normalizedTitle)) {
                    return false; // 중복이므로 제거
                }
                seen.add(normalizedTitle);
                return true; // 첫 번째 등장이므로 유지
            });
            
            return {
                ...state,
                videos: uniqueVideos
            };
        }

        default:
        return state;
    }
}
