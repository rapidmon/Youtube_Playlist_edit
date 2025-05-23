import { createGlobalStyle, styled } from 'styled-components';
import reset from 'styled-reset';
import { useState } from 'react';

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
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
`;

function App() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [videos, setVideos] = useState<{ videoId: string; title: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const FUNCTION_URL = 'https://ebvq4aiwxwcswb4oe5a6di72rq0eeorh.lambda-url.ap-southeast-2.on.aws/';

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistUrl }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err: any) {
      setError(err.message || '알 수 없는 에러');
    } finally {
      setLoading(false);
    }
  };

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
          <SubmitButton type="submit">Go</SubmitButton>
        </Form>

        {loading && <p>로딩 중...</p>}
        {error && <p style={{ color: 'red' }}>에러: {error}</p>}

        <List>
          {videos.map((video) => (
            <ListItem key={video.videoId}>{video.title}</ListItem>
          ))}
        </List>
      </AppContainer>
    </>
  );
}

export default App;