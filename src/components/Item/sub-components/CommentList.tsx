import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Comment } from '../../../interfaces/Comment';

//MUI
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { formatDistanceToNow } from 'date-fns'; // For relative timestamps

interface CommentListProps {
  item_id: number;
  item_categories_id: number;
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ item_id, item_categories_id, comments }) => {
  const [commentList, setCommentList] = useState<Comment[]>([]);

  useEffect(() => {
    // Fetch comments based on item_id and item_categories_id
    axios
      .get(`https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app/items/comments/get?item_id=${item_id}&item_categories_id=${item_categories_id}`)
      .then((response) => {
        // Check if the response data contains the 'comments' property
        if (Array.isArray(response.data) && response.data.length > 0) {
          setCommentList(response.data);
          console.log('Comments:', response.data);
        } else {
          setCommentList([]); // Set comments to an empty array if there are no comments
        }
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
        setCommentList([]); // Handle the error by setting comments to an empty array
      });
  }, [item_id, item_categories_id, comments]);

    return (
      <Paper elevation={4} sx={{ padding: 2 }}>
        {commentList.length === 0 ? (
          <Typography variant="subtitle1">No comments yet!</Typography>
        ) : (
          <div>
            <Typography variant="h6" gutterBottom>
              Comments: {commentList.length}
            </Typography>
            <List dense>
              {commentList.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start">
                  <ListItemText
                    primary={comment.comment}
                    secondary={
                      <>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {comment.name} - 
                        </Typography>
                        {formatDistanceToNow(new Date(comment.updated_at), { addSuffix: true })}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </Paper>
    );
};

export default CommentList;
