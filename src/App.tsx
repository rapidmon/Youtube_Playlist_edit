import { createGlobalStyle, styled, keyframes, css } from 'styled-components';
import reset from 'styled-reset';
import { useReducer, useEffect, useState } from 'react';
import { MusicList } from './components/list';
import { reducer } from './reducer';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const Globalstyle = createGlobalStyle`
  ${reset}
  
  body {
    min-height: 100vh;
    color: #333;
    background-color: #bebeec;
  }
  
  * {
    box-sizing: border-box;
  }
`;

const AppContainer = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 16px;
  ${css`
    animation: ${fadeIn} 0.6s ease-out;
  `}
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 20px;
  text-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const Subtitle = styled.p`
  font-size: 18px;
  font-weight: 300;
`;

const MainCard = styled.div`
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  ${css`
    animation: ${fadeIn} 0.8s ease-out 0.2s both;
  `}
`;

const Form = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const PlaylistInput = styled.input`
  flex: 1;
  padding: 16px 20px;
  font-size: 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  outline: none;
  transition: all 0.3s ease;
  background: #fff;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const SubmitButton = styled.button`
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #adb5bd 0%, #868e96 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ControlsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.05);
`;

const ControlButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  ${({ $variant = 'secondary' }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
          color: white;
          &:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3); }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          &:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3); }
        `;
      default:
        return `
          background: #fff;
          color: #495057;
          border: 1px solid #dee2e6;
          &:hover { background: #f8f9fa; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        `;
    }
  }}
  
  &:active {
    transform: translateY(0);
  }
`;

const SortGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const SortLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-right: 8px;
`;

const StateText = styled.p<{ type?: 'error' | 'loading' }>`
  font-size: ${({ type }) => (type === 'error' ? '16px' : '14px')};
  color: ${({ type }) => (type === 'error' ? '#dc3545' : '#6c757d')};
  text-align: center;
  margin-top: 16px;
  font-weight: 500;
  
  ${({ type }) => type === 'loading' && css`
    background: linear-gradient(90deg, #f8f9fa 0px, #e9ecef 40px, #f8f9fa 80px);
    background-size: 200px;
    animation: ${shimmer} 1.5s infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}
`;

const SearchSection = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 12px;
  border: 1px solid rgba(255, 193, 7, 0.2);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-left: 40px;
  font-size: 16px;
  border: 2px solid #ffb74d;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  background: #fff;
  
  &:focus {
    border-color: #ff9800;
    box-shadow: 0 0 0 4px rgba(255, 152, 0, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #bcaaa4;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  
  &::before {
    content: '🔍';
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    z-index: 1;
  }
`;

const SearchStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 13px;
  color: #8d6e63;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #ff9800;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 152, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const VideoCount = styled.div`
  text-align: center;
  margin: 16px 0;
  padding: 12px;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-radius: 12px;
  font-weight: 600;
  color: #1565c0;
`;

function App() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [state, dispatch] = useReducer(reducer, { videos: [] });
  const { videos } = state;
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [loading_dots, setLoading_dots] = useState('');
  const [error, setError] = useState('');
  const FUNCTION_URL = 'https://x3xsycktqdflzobc6sqcg72rfe0wikxn.lambda-url.ap-southeast-2.on.aws/';

  // 한글 자음/모음 단일 입력 체크 함수
  const isIncompleteKorean = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length !== 1) return false;
    
    const char = trimmed.charCodeAt(0);
    // 한글 자음 (ㄱ-ㅎ): 0x3131-0x314E
    // 한글 모음 (ㅏ-ㅣ): 0x314F-0x3163
    return (char >= 0x3131 && char <= 0x314E) || (char >= 0x314F && char <= 0x3163);
  };

  // 검색 필터링
  const filteredVideos = videos.filter(video => {
    if (!searchQuery.trim() || isIncompleteKorean(searchQuery)) return true;
    
    const query = searchQuery.toLowerCase();
    const title = (video.title || '').toLowerCase();
    const uploader = (video.uploader || '').toLowerCase();
    
    return title.includes(query) || uploader.includes(query);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistUrl(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: playlistUrl }),
      });
      const data = await response.json();
      dispatch({ type: 'SET_VIDEOS', payload: data.videos || []});
    } catch (err: any) {
      setError(err.message || '알 수 없는 에러');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => dispatch({ type: 'REMOVE_VIDEO', payload: id });
  const handleReorder = (oldIndex: number, newIndex: number) => 
    dispatch({ type: 'REORDER_VIDEOS', payload: { oldIndex, newIndex } });

  // 정렬 핸들러들
  const handleSortByTitleAsc = () => dispatch({ type: 'SORT_BY_TITLE_ASC' });
  const handleSortByTitleDesc = () => dispatch({ type: 'SORT_BY_TITLE_DESC' });
  const handleSortByArtistAsc = () => dispatch({ type: 'SORT_BY_ARTIST_ASC' });
  const handleSortByArtistDesc = () => dispatch({ type: 'SORT_BY_ARTIST_DESC' });
  const handleShuffle = () => dispatch({ type: 'SHUFFLE' });
  
  // 중복 삭제
  const handleRemoveDuplicates = () => {
    const duplicateCount = videos.length - new Set(videos.map(v => v.title.toLowerCase().trim())).size;
    if (duplicateCount > 0) {
      if (window.confirm(`${duplicateCount}개의 중복된 제목을 삭제하시겠습니까?`)) {
        dispatch({ type: 'REMOVE_DUPLICATES' });
      }
    } else {
      alert('중복된 항목이 없습니다! 🎉');
    }
  };
  
  useEffect(() => {
    if(!loading) return;
    const interval = setInterval(() => {
      setLoading_dots((prev) => {
        if(prev === '...') return '';
        return prev + '.';
      })
    }, 500)

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <>
      <Globalstyle />
      <AppContainer>
        <Header>
          <Title>YouTube Playlist Editor</Title>
          <Subtitle>플레이리스트를 불러와서 편집하고 정렬해보세요</Subtitle>
        </Header>
        
        <MainCard>
          <Form onSubmit={handleSubmit}>
            <PlaylistInput
              type="text"
              placeholder="🔗 YouTube 플레이리스트 URL을 입력하세요"
              value={playlistUrl}
              onChange={handleChange}
            />
            <SubmitButton type="submit" disabled={loading}>
              {loading ? '⏳ 로딩중...' : '🚀 불러오기'}
            </SubmitButton>
          </Form>

          {videos.length > 0 && (
            <>
              <VideoCount>
                📊 총 {videos.length}개의 비디오
              </VideoCount>
              
              <SearchSection>
                <SearchContainer>
                  <SearchInput
                    type="text"
                    placeholder="제목이나 가수명으로 검색하세요..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </SearchContainer>
                <SearchStats>
                  <span>
                    {searchQuery.trim() && !isIncompleteKorean(searchQuery) 
                      ? `${filteredVideos.length}개 항목 검색됨` 
                      : '전체 항목 표시'}
                  </span>
                  {searchQuery.trim() && !isIncompleteKorean(searchQuery) && (
                    <ClearButton onClick={handleClearSearch}>
                      ✕ 검색 초기화
                    </ClearButton>
                  )}
                </SearchStats>
              </SearchSection>
              
              <ControlsSection>
                <SortGroup>
                  <SortLabel>🎵 제목 정렬:</SortLabel>
                  <ControlButton onClick={handleSortByTitleAsc}>
                    ↑ 가나다순
                  </ControlButton>
                  <ControlButton onClick={handleSortByTitleDesc}>
                    ↓ 역순
                  </ControlButton>
                </SortGroup>
                
                <SortGroup>
                  <SortLabel>👨‍🎤 가수 정렬:</SortLabel>
                  <ControlButton onClick={handleSortByArtistAsc}>
                    ↑ 가나다순
                  </ControlButton>
                  <ControlButton onClick={handleSortByArtistDesc}>
                    ↓ 역순
                  </ControlButton>
                </SortGroup>
                
                <ControlButton $variant="primary" onClick={handleShuffle}>
                  🎲 랜덤 섞기
                </ControlButton>
                
                <ControlButton $variant="danger" onClick={handleRemoveDuplicates}>
                  🔄 중복 삭제
                </ControlButton>
              </ControlsSection>
            </>
          )}

          <MusicList videos={filteredVideos} onDelete={handleDelete} onReorder={handleReorder} searchQuery={searchQuery} />
          
          {loading && (
            <StateText type='loading'>
              🎵 플레이리스트 불러오는 중{loading_dots}
            </StateText>
          )}
          {error && (
            <StateText type='error'>
              ❌ 에러: {error}
            </StateText>
          )}
        </MainCard>
      </AppContainer>
    </>
  );
}

export default App;