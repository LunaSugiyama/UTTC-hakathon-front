import BookIcon from '@mui/icons-material/Book';
import BlogIcon from '@mui/icons-material/Article'; // Example icon for blogs
import VideoIcon from '@mui/icons-material/OndemandVideo';

const getIconForCategory = (category: string) => {
    switch (category) {
        case 'books':
            return <BookIcon />;
        case 'blogs':
            return <BlogIcon />;
        case 'videos':
            return <VideoIcon />;
        default:
            return null; // or some default icon
    }
};

export default getIconForCategory;