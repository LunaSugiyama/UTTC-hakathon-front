import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Comment } from '../../../interfaces/Comment';

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
      .get(`http://localhost:8000/items/comments/get?item_id=${item_id}&item_categories_id=${item_categories_id}`)
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
    <div>
      {commentList.length === 0 ? ( 
      <p>No comments yet!</p>
      ) : ( 
      <div>
        <h3>Comments: {commentList.length}</h3>
          <ul>
            {commentList.map((comment) => (
              <li key={comment.id}>{comment.comment}</li>
            ))}
          </ul>
      </div>
      )}
    </div>
  );
};

export default CommentList;
