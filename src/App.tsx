import { createGlobalStyle, styled } from 'styled-components';
import reset from 'styled-reset';
import { useEffect, useState } from 'react';
import { MusicList } from './components/list';

const Globalstyle = createGlobalStyle`
  ${reset}
`

const AppContainer = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
`;

const Form = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const PlaylistInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  &:focus {
    border-color: #0073e6;
  }
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  background-color: #0073e6;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #005bb5;
  }
  &:disabled {
    background-color: gray;
    cursor: default;
  }
`;

const StateText = styled.p<{ type?: 'error' | 'loading' }>`
  font-size: ${({ type }) => (type === 'error' ? '16px' : '14px')};
  color: ${({ type }) => (type === 'error' ? '#ff5151' : 'gray')};
`;

function App() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [videos, setVideos] = useState<{ videoId: string; title: string; url: string; uploader: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [loading_dots, setLoading_dots] = useState('');
  const [error, setError] = useState('');
  const FUNCTION_URL = 'https://x3xsycktqdflzobc6sqcg72rfe0wikxn.lambda-url.ap-southeast-2.on.aws/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistUrl(e.target.value);
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
      console.log(data);
      setVideos(data.videos || []);
    } catch (err: any) {
      setError(err.message || '알 수 없는 에러');
    } finally {
      setLoading(false);
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
        <Title>YouTube Music Playlist Editor</Title>
        <Form onSubmit={handleSubmit}>
          <PlaylistInput
            type="text"
            placeholder="플레이리스트 URL을 입력하세요"
            value={playlistUrl}
            onChange={handleChange}
          />
          <SubmitButton type="submit" disabled={loading}>Go</SubmitButton>
        </Form>

        <MusicList videos={videos}></MusicList>
        {loading && <StateText type='loading'>플레이 리스트 불러오는 중{loading_dots}</StateText>}
        {error && <StateText type='error'>에러: {error}</StateText>}

      </AppContainer>
    </>
  );
}

export default App;