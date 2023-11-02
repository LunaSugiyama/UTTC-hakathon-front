import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';

// Define an interface that matches your data structure
interface YourData {
  ID: number;
  UserID: number;
  Title: string;
  Author: string;
  Link: string;
  Likes: number;
  ItemCategoriesID: number;
  ItemCategoriesName: string;
  // Add other properties as needed
}

const Home = () => {
  const [data, setData] = useState<YourData[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/items/showall')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <div>
      <h2>Welcome to the Home page!</h2>
      <ul>
        {data.map((item) => (
          <li key={item.ID}>
            <Link to={`/item/${item.ItemCategoriesName}/${item.ID}`}>
              <button>
                User ID: {item.UserID} <br />
                Title: {item.Title} <br />
                Author: {item.Author} <br />
                Link: {item.Link} <br />
                Likes: {item.Likes} <br />
                Item Category: {item.ItemCategoriesName}
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
