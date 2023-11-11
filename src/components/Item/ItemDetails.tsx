import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import StarButton from './sub-components/StarItem';
import LikeButton from './sub-components/LikeItem';
import LikeCount from './LikeCount';
import { ItemDetails as ItemDetailsType } from '../../interfaces/ItemDetails';
import { Comment } from '../../interfaces/Comment';
import CommentInput from './sub-components/CommentInput';
import CommentList from './sub-components/CommentList';
import Layout from '../../item/layout/Layout';

// MUI
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Link as MuiLink,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a green theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#004d40', // Dark Green
    },
    secondary: {
      main: '#a5d6a7', // Light Green
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
          transition: '0.3s',
          '&:hover': {
            boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '10px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          marginBottom: '10px',
        },
      },
    },
  },
});

const ItemDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id, category }: { id?: string; category?: string } = useParams();
  const [item, setItem] = useState<ItemDetailsType | null>(null);
  const [curriculumNames, setCurriculumNames] = useState<string[]>([]);
  const [loadingCurriculumNames, setLoadingCurriculumNames] = useState(true);
  const token = Cookies.get('token');
  const [loadStarButton, setLoadStarButton] = useState(false);
  const [isItemStarred, setIsItemStarred] = useState(false);
  const [isItemLiked, setIsItemLiked] = useState(false);
  const [loadLikeButton, setLoadLikeButton] = useState(false);
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]); 

  // come back to the same home page
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sortParam = queryParams.get('sort');
  const orderParam = queryParams.get('order');
  const categoryParam = queryParams.get('category');
  const pageParam = queryParams.get('page');
  const page_sizeParam = queryParams.get('page_size');
  const backToHomeLink = `/item`;

  const handleDeleteItem = () => {
    if (item) {
      axios
        .delete(`http://localhost:8000/${category}/delete`, {
          data: { id: item.id }, // Send the ID as raw JSON in the request body
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response);
          window.location.href = backToHomeLink
        })
        .catch((error) => {
          console.error('Error deleting item: ', error);
        });
    }
  };

  const handleLike = () => {
    if (item) {
      setIsItemLiked(true); // Update the liked state
      // Fetch and update the like count
      fetchLikeCount(item.id, item.item_categories_id);
    }
  };
  
  

  const fetchLikeCount = (itemId: number, itemCategoriesId: number) => {
    // Make an API request to get the like count for the specified item
    axios
      .get(`http://localhost:8000/items/countlikes?item_id=${itemId}&item_categories_id=${itemCategoriesId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLikeCount(response.data.count);
      })
      .catch((error) => {
        console.error('Error fetching like count:', error);
      });
  };

  const fetchComments = (itemId: number, itemCategoriesId: number) => {
    axios
      .get(`http://localhost:8000/items/comments/get?item_id=${itemId}&item_categories_id=${itemCategoriesId}`)
      .then((response) => {
        setComments(response.data.comments);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  };

  useEffect(() => {
    if (id) {
      const itemId = parseInt(id, 10);

      // Fetch item details based on the ID from the URL
      axios
        .get(`http://localhost:8000/${category}/get?id=${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setItem(response.data);
          setLoadStarButton(true);
          setIsItemStarred(response.data.is_starred);
          setLoadLikeButton(true);
          setIsItemLiked(response.data.is_liked);
        })
        .catch((error) => {
          console.error('Error fetching item details: ', error);
        });
    }
  }, [category, id, token]);

  useEffect(() => {
    if (item && item.curriculum_ids) {
      // Map through curriculum_ids and fetch curriculum names for each ID
      Promise.all(
        item.curriculum_ids.map((curriculumId) =>
          axios.get(`http://localhost:8000/curriculums/get?id=${curriculumId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      )
        .then((responses) => {
          const names = responses.map((response) => response.data.name);
          setCurriculumNames(names);
          setLoadingCurriculumNames(false);
        })
        .catch((error) => {
          console.error('Error fetching curriculum names: ', error);
          setLoadingCurriculumNames(false);
        });
    } else {
      setLoadingCurriculumNames(false);
    }
  }, [item, token]);

  return (
    <Layout>
    <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ my: 8, mx: 4, p: 3 , backgroundColor: '#f5f5f5'}}>
        {item ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <IconButton onClick={() => navigate(backToHomeLink)} aria-label="back">
                <ArrowBackIcon />
              </IconButton>
              <Typography component="h1" variant="h5" align="center">
                Item Details
              </Typography>
              <IconButton onClick={handleDeleteItem} aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2} justifyContent="center">
            {/* Images */}
            {item.images.map((imageLink, index) => (
              <Grid item xs={12} sm={12} md={8} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ maxWidth: 600, maxHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <a href={imageLink} target="_blank" rel="noopener noreferrer">
                    <CardMedia
                      component="img"
                      image={imageLink}
                      alt={`Image ${index}`}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto'
                      }}
                    />
                  </a>
                </Card>
              </Grid>
            ))}
      {/* Text Content */}
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="subtitle1">
              Author: {item.author}
            </Typography>
            <Typography variant="subtitle1">
              {item.item_categories_name} ID: {item.id}
            </Typography>
            <Typography variant="subtitle1">
              User ID: {item.user_id}
            </Typography>
            <Typography variant="subtitle1">
              Link: <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a>
            </Typography>
            <LikeCount itemID={item.id} itemCategoriesID={item.item_categories_id} isItemLiked={isItemLiked}/>
            <Typography variant="subtitle1">
              Item Category: {item.item_categories_name}
            </Typography>
            <Typography variant="subtitle1">
              Curriculum: {loadingCurriculumNames ? <CircularProgress size={20} /> : curriculumNames.join(', ')}
            </Typography>
            <Typography variant="body1" paragraph>
              Explanation: {item.explanation}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <MuiLink component={Link} to={`/item/${item ? item.item_categories_name : 'loading'}/${item ? item.id : 'loading'}/edit`}>
                <Button startIcon={<EditIcon />} variant="outlined">
                  Edit Item
                </Button>
              </MuiLink>

              {loadStarButton && 
              <StarButton
                item={{ id: item.id, isStarred: isItemStarred, item_categories_id: item.item_categories_id }}
                onStar={(starredItem) => {
                  // Handle the star action (you can perform an API request to update the star status)
                }}
              />}
              {loadLikeButton && 
              <LikeButton
                item={{ id: item.id, isLiked: isItemLiked, item_categories_id: item.item_categories_id }}
                onLike={() => handleLike()}
              />}

            <LikeCount itemID={item.id} itemCategoriesID={item.item_categories_id} isItemLiked={isItemLiked}/>            </Box>
            
            <CommentInput
              item={{ item_id: item.id, item_categories_id: item.item_categories_id }}
              onCommentSubmit={() => fetchComments(item.id, item.item_categories_id)}
            />
            <CommentList item_id={item.id} item_categories_id={item.item_categories_id} comments={comments} />
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </Container>
    </ThemeProvider>
    </Layout>
  );
};

export default ItemDetails;