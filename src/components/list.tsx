import { styled } from 'styled-components';

const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const ListItem = styled.li`
    padding: 8px 12px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const Thumbnail = styled.img`
    width: 120px;
    height: auto;
    border-radius: 4px;
    cursor: pointer;
`

const Link = styled.a`
    color: black;
    text-decoration: none;
`

type Video = {
    videoId: string;
    title: string;
    url: string;
    uploader: string;
};

type MusicListProps = {
    videos: Video[];
};

export function MusicList({ videos }: MusicListProps){
    return (
        <List>
            {videos.map((video, index) => (
                <ListItem key={`${video.videoId}-${index}`}>
                <Link href={video.url} target="_blank" rel="noopener noreferrer">
                    <Thumbnail src={`https://img.youtube.com/vi/${video.videoId}/default.jpg`} alt={video.title} />
                </Link>
                <Link href={video.url} target="_blank" rel="noopener noreferrer">
                    {index + 1}. {video.title}<br/>{video.uploader}
                </Link>
                </ListItem>
            ))}
        </List>
    )
}