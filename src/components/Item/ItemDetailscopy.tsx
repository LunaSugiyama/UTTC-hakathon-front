import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import StarButton from './sub-components/StarItem';
import LikeButton from './sub-components/LikeItem';
import LikeCount from './LikeCount';
import { ItemDetails as ItemDetailsType } from '../../interfaces/ItemDetails';
import { Comment } from '../../interfaces/Comment';
import CommentInput from './sub-components/CommentInput';
import CommentList from './sub-components/CommentList';

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
  Link as MuiLink,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const ItemDetails: React.FC = () => {
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
  const backToHomeLink = `/home?sort=${sortParam}&order=${orderParam}&category=${categoryParam}&page=${pageParam}&page_size=${page_sizeParam}`;
  console.log('backToHomeLink', backToHomeLink);

  const handleDeleteItem = () => {
    if (item) {
      axios
        .delete(`https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app/${category}/delete`, {
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
      .get(`https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app/items/countlikes?item_id=${itemId}&item_categories_id=${itemCategoriesId}`, {
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
      .get(`https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app/items/comments/get?item_id=${itemId}&item_categories_id=${itemCategoriesId}`)
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
        .get(`https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app/${category}/get?id=${itemId}`, {
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
          axios.get(`https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app/curriculums/get?id=${curriculumId}`, {
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
    <Container component="main" maxWidth="md">
    <div>
      {item ? (
        <Paper elevation={3} sx={{ my: 8, mx: 4, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          < Typography component="h1" variant="h5">
            Item Details
          </Typography>
        <div>
          <Link to={backToHomeLink}>Back to Home</Link>
          <h3>Images</h3>
          <Box className="image-container" sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          {item.images.map((imageLink, index) => (
            <Box key={index} component="img" src={imageLink} alt={`Image ${index}`} sx={{ width: 100, height: 100 }} />
          ))}
        </Box>
          <p>ID: {item.id}</p>
          <p>User ID: {item.user_firebase_uid}</p>
          <p>Title: {item.title}</p>
          <p>Author: {item.author}</p>
          <p>Link: {item.link}</p>
          <LikeCount itemID={item.id} itemCategoriesID={item.item_categories_id} isItemLiked={isItemLiked}/>
          <p>Item Category: {item.item_categories_name}</p>
          <p>Explanation: {item.explanation}</p>
          <p>Curriculum: {loadingCurriculumNames ? 'Loading...' : curriculumNames.join(', ')}</p>
          <Link
            to={`/item/${item ? item.item_categories_name : 'loading'}/${item ? item.id : 'loading'}/edit`}
          >
            <button>Edit Item</button>
          </Link>
          {loadStarButton && (
            <StarButton
              item={{ id: item.id, isStarred: isItemStarred, item_categories_id: item.item_categories_id }}
              onStar={(starredItem) => {
                // Handle the star action (you can perform an API request to update the star status)
              }}
            />
          )}
          {loadLikeButton && (
            <LikeButton
              item={{ id: item.id, isLiked: isItemLiked, item_categories_id: item.item_categories_id }}
              onLike={() => handleLike()}
            />
          )}
          <button onClick={handleDeleteItem}>Delete Item</button>
          <CommentInput
            item={{ item_id: item.id, item_categories_id: item.item_categories_id }}
            onCommentSubmit={() => fetchComments(item.id, item.item_categories_id)}
          />
          <CommentList item_id={item.id} item_categories_id={item.item_categories_id} comments={comments} />
        </div>
        </Paper>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </Container>
  );
};

export default ItemDetails;
