import React, { useState, useEffect} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { fireAuth } from "../../../firebase";

// MUI
import Button from '@mui/material/Button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

interface LikeButtonProps {
    item: { id: number; isLiked: boolean; item_categories_id: number };
    onLike: (item: { id: number; isLiked: boolean; item_categories_id: number }) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ item, onLike }) => {
    const [isLiked, setIsLiked] = useState(item.isLiked);

    useEffect(() => {
        // Update the button text based on the item's liked state
        checkIfItemIsLiked();
    }, [item.isLiked]);

    const toggleLike = () => {
        // Toggle the like/unlike action based on the current state
        if (isLiked) {
            unlikeItem();
        } else {
            likeItem();
        }
    };

    const checkIfItemIsLiked = () => {
        const user_id = fireAuth.currentUser?.uid;

        if (!user_id) {
            // Wait and try again after a short delay
            setTimeout(() => {
                checkIfItemIsLiked();
            }, 50); // Adjust the delay as needed
            return;
        }

        // Make an HTTP GET request to the /checkliked endpoint
        axios.get(`http://localhost:8000/items/checkliked`, {
            params: {
                item_id: item.id,
                item_categories_id: item.item_categories_id,
                user_firebase_uid: user_id,
            },
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        })
            .then((response) => {
                // Update the isLiked state based on the response
                setIsLiked(response.data.isLiked);
            })
            .catch((error) => {
                // Handle errors here
                console.error("Error checking if the item is liked:", error);
            });
    };

    const likeItem = () => {
        axios.post(`http://localhost:8000/items/like`, {
            item_id: item.id,
            item_categories_id: item.item_categories_id,
            user_firebase_uid: fireAuth.currentUser?.uid,
        }, {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        })
            .then((response) => {
                // Update the isLiked state based on the response
                setIsLiked(true);
                onLike({ ...item, isLiked: true });
            })
            .catch((error) => {
                // Handle errors here
                console.error("Error liking the item:", error);
            });
    };

    const unlikeItem = () => {
        axios.post(`http://localhost:8000/items/unlike`, {
            item_id: item.id,
            item_categories_id: item.item_categories_id,
            user_firebase_uid: fireAuth.currentUser?.uid,
        }, {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        })
            .then((response) => {
                // Update the isLiked state based on the response
                setIsLiked(false);
                onLike({ ...item, isLiked: false });
            })
            .catch((error) => {
                // Handle errors here
                console.error("Error unliking the item:", error);
            });
    };

    return (
        <Button
            variant="contained"
            startIcon={isLiked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
            onClick={toggleLike}
            sx={{
                textTransform: 'none',
                backgroundColor: isLiked ? 'green' : 'white',
                color: isLiked ? 'white' : 'black', // Assuming you want text color to be black when the button is white
                '&:hover': {
                    backgroundColor: isLiked ? '#a5d6a7' : '#eeeeee', // Lighter red for hover on liked, light gray for unliked
                },
            }}
        >
            {isLiked ? "Unlike" : "Like"}
        </Button>
    );
};

export default LikeButton;