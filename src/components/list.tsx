import { styled } from 'styled-components';
import trash_can from '../assets/images/trash_can.svg';
import { Video } from '../types';
import { useState, useRef, useEffect } from 'react';

// const dragHover = keyframes`
//   0% { transform: translateY(0); }
//   50% { transform: translateY(-2px); }
//   100% { transform: translateY(0); }
// `;

const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const DeleteBtn = styled.button`
    align-self: stretch;
    width: 40px;
    margin-left: auto;
    background: url(${trash_can}) no-repeat center/20px 20px;
    padding: 0 20px;
    border: none;
    transition: all 0.2s ease;
    cursor: pointer;
`;

const ListItem = styled.li<{ 
    $isDragging?: boolean; 
    $isDragOver?: boolean;
}>`
    padding: 8px 12px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    cursor: grab;
    transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
    
    background-color: ${props => 
        props.$isDragOver ? '#e3f2fd' : 
        props.$isDragging ? '#f8f9fa' : 'white'};
    
    opacity: ${props => props.$isDragging ? 0.6 : 1};
    transform: ${props => 
        props.$isDragOver ? 'translateY(-2px)' : 'translateY(0)'};
    
    box-shadow: ${props => 
        props.$isDragging ? '0 8px 25px rgba(0,0,0,0.15)' :
        props.$isDragOver ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'};
    
    border-top: ${props => props.$isDragOver ? '3px solid #2196f3' : 'none'};
    border-radius: ${props => props.$isDragging ? '8px' : '0'};
    
    &:active {
        cursor: grabbing;
    }
    
    &:hover:not(:active) {
        background-color: #f5f5f5;
    }
    
    &:has(${DeleteBtn}:hover){
        background-color: #b94040 !important;
    }
`;

const DragHandle = styled.div`
    width: 24px;
    height: 24px;
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 20px;
    transition: all 0.2s ease;
    border-radius: 4px;
    
    &:hover {
        background-color: #f0f0f0;
        color: #2196f3;
        transform: scale(1.1);
    }
    
    &:active {
        cursor: grabbing;
        background-color: #e3f2fd;
    }
    
    &::before {
        content: '⋮⋮';
        letter-spacing: 2px;
        font-weight: bold;
    }
`;

const Thumbnail = styled.img`
    width: 120px;
    height: auto;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
`;

const Link = styled.a`
    color: black;
    text-decoration: none;
    line-height: 150%;
    transition: color 0.2s ease;
    
    &:hover {
        color: #2196f3;
    }
`;

const AutoScrollZone = styled.div<{ $position: 'top' | 'bottom'; $active: boolean }>`
    position: fixed;
    left: 0;
    right: 0;
    height: 80px;
    ${props => props.$position === 'top' ? 'top: 0;' : 'bottom: 0;'}
    background: ${props => props.$active ? 
        (props.$position === 'top' 
            ? 'linear-gradient(to bottom, rgba(33, 150, 243, 0.2), transparent)'
            : 'linear-gradient(to top, rgba(33, 150, 243, 0.2), transparent)')
        : 'transparent'};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    pointer-events: none;
    font-size: 24px;
    color: #2196f3;
    
    &::before {
        content: '${props => props.$active ? (props.$position === 'top' ? '↑ 스크롤' : '↓ 스크롤') : ''}';
    }
`;

const HighlightedText = styled.span`
    background: linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%);
    color: #e65100;
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(230, 81, 0, 0.2);
`;

type MusicListProps = {
    videos: Video[];
    onDelete: (videoId: string) => void;
    onReorder: (oldIndex: number, newIndex: number) => void;
    searchQuery?: string;
};

// 한글 자음/모음 단일 입력 체크 함수
const isIncompleteKorean = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length !== 1) return false;
    
    const char = trimmed.charCodeAt(0);
    return (char >= 0x3131 && char <= 0x314E) || (char >= 0x314F && char <= 0x3163);
};

// 검색어 하이라이팅 함수
const highlightText = (text: string, query: string) => {
    if (!query.trim() || !text || isIncompleteKorean(query)) return text || '';
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
        part.toLowerCase() === query.toLowerCase() 
            ? <HighlightedText key={index}>{part}</HighlightedText>
            : part
    );
};

export function MusicList({ videos, onDelete, onReorder, searchQuery = '' }: MusicListProps) {
    const [draggedItem, setDraggedItem] = useState<Video | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [autoScrolling, setAutoScrolling] = useState<'up' | 'down' | null>(null);
    const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // 자동 스크롤 시작
    const startAutoScroll = (direction: 'up' | 'down') => {
        if (scrollIntervalRef.current) return;
        
        setAutoScrolling(direction);
        scrollIntervalRef.current = setInterval(() => {
            const scrollAmount = direction === 'up' ? -5 : 5;
            window.scrollBy(0, scrollAmount);
        }, 16);
    };

    // 자동 스크롤 정지
    const stopAutoScroll = () => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
        setAutoScrolling(null);
    };

    // 드래그 이벤트 핸들러들
    const handleDragStart = (e: React.DragEvent, video: Video) => {
        setDraggedItem(video);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', video.videoId);
        
        // 드래그 중 마우스 움직임 감지를 위한 리스너 추가
        const handleDragMove = (e: DragEvent) => {
            const threshold = 80;
            if (e.clientY < threshold) {
                startAutoScroll('up');
            } else if (e.clientY > window.innerHeight - threshold) {
                startAutoScroll('down');
            } else {
                stopAutoScroll();
            }
        };

        // dragover 이벤트로 마우스 위치 추적
        document.addEventListener('dragover', handleDragMove);
        
        // 드래그 종료시 리스너 제거
        const cleanup = () => {
            document.removeEventListener('dragover', handleDragMove);
            document.removeEventListener('dragend', cleanup);
            stopAutoScroll();
        };
        document.addEventListener('dragend', cleanup);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverIndex(null);
        stopAutoScroll();
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setDragOverIndex(null);
        }
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        
        if (!draggedItem) return;

        const dragIndex = videos.findIndex(video => video.videoId === draggedItem.videoId);
        
        if (dragIndex !== dropIndex) {
            onReorder(dragIndex, dropIndex);
        }

        setDraggedItem(null);
        setDragOverIndex(null);
        stopAutoScroll();
    };

    // 컴포넌트 언마운트시 정리
    useEffect(() => {
        return () => {
            stopAutoScroll();
        };
    }, []);

    return (
        <>
            <AutoScrollZone $position="top" $active={autoScrolling === 'up'} />
            <AutoScrollZone $position="bottom" $active={autoScrolling === 'down'} />
            
            <List>
                {videos.map((video, index) => {
                    const isDragging = draggedItem?.videoId === video.videoId;
                    const isDragOver = dragOverIndex === index;
                    
                    return (
                        <ListItem
                            key={`${video.videoId}-${index}`}
                            draggable
                            $isDragging={isDragging}
                            $isDragOver={isDragOver}
                            onDragStart={(e) => handleDragStart(e, video)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            data-id={video.videoId}
                        >
                            <DragHandle />
                            <Link href={video.url} target="_blank" rel="noopener noreferrer">
                                <Thumbnail 
                                    src={`https://img.youtube.com/vi/${video.videoId}/default.jpg`} 
                                    alt={video.title || '썸네일'}
                                />
                            </Link>
                            <Link href={video.url} target="_blank" rel="noopener noreferrer">
                                {index + 1}. {highlightText(video.title || '제목 없음', searchQuery)}<br/>{highlightText(video.uploader || '가수 정보 없음', searchQuery)}
                            </Link>
                            <DeleteBtn onClick={() => onDelete(video.videoId)}></DeleteBtn>
                        </ListItem>
                    );
                })}
            </List>
        </>
    );
}