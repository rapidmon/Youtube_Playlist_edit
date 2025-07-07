import { styled } from 'styled-components';
import trash_can from '../assets/images/trash_can.svg';

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
    &:hover{
        background-color: #b94040;
    }
    cursor: pointer;
`

const ListItem = styled.li`
    padding: 8px 12px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    &:has(${DeleteBtn}:hover){
        background-color: #b94040;
    }
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
    line-height: 150%;
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
                    <DeleteBtn></DeleteBtn>
                </ListItem>
            ))}
        </List>
    )
}