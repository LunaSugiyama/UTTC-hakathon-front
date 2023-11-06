import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CurriculumCheckbox from './curriculum/Checkbox'; // Import the CurriculumCheckbox component
import Cookies from 'js-cookie';
import Logout from './user/Logout';

interface ItemWithCurriculum {
  ID: number;
  UserFirebaseUID: number;
  Title: string;
  Author: string;
  Link: string;
  Likes: number;
  ItemCategoriesID: number;
  ItemCategoriesName: string;
  CreatedAt: string;
  UpdatedAt: string;
  CurriculumID: number;
  CurriculumIDs: number[];
}

interface ItemCategory {
  ID: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}


const Home: React.FC = () => {
  const token = Cookies.get('token');
  const [data, setData] = useState<ItemWithCurriculum[]>([]);
  const [sort, setSort] = useState('created_at');
  const [order, setOrder] = useState('asc');
  const [curriculumIds, setCurriculumIds] = useState<number[]>([]);
  const [curriculumData, setCurriculumData] = useState<any[]>([]);
  const [ItemCategoriesIds, setItemCategoriesIds] = useState<number[]>([]);
  const [itemCategoriesData, setItemCategoriesData] = useState<ItemCategory[]>([]);

  const [selectedCurriculumIds, setSelectedCurriculumIds] = useState<number[]>([]);

  const fetchData = () => {
    axios
      .get(
        `http://localhost:8000/items/showall?sort=${sort}&order=${order}&item_categories=${ItemCategoriesIds.join(',')}&curriculum_ids=${selectedCurriculumIds.join(',')}`, {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  };
  


  const fetchCurriculumData = () => {
    axios
      .get(`http://localhost:8000/curriculums/showall`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setCurriculumData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching curriculum data: ', error);
      });
  };

  const fetchItemCategories = () => {
    axios
      .get(`http://localhost:8000/item_categories/showall`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setItemCategoriesData(response.data); // Set the array of category IDs
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching item categories: ', error);
      });
  };

  const handleApplyFilters = () => {
    setData([]); // Clear the data before fetching new data
    fetchData();
  };

  const handleCreateItem = () => {
    window.location.href = '/item/create-item';
  }

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
    fetchCurriculumData(); // Fetch curriculum data when the component mounts
    fetchItemCategories(); // Fetch item categories when the component mounts
  }, []); // Moved the curriculum data fetching to a useEffect


  const handleCheckboxChange = (curriculumId: number) => {
    // Toggle the selected curriculum ID
    if (selectedCurriculumIds.includes(curriculumId)) {
      setSelectedCurriculumIds(selectedCurriculumIds.filter((id) => id !== curriculumId));
    } else {
      setSelectedCurriculumIds([...selectedCurriculumIds, curriculumId]);
    }
  };
  

  const handleItemCategoriesCheckboxChange = (categoryId: number) => {
    // Toggle the selected item category
    if (ItemCategoriesIds.includes(categoryId)) {
      setItemCategoriesIds(ItemCategoriesIds.filter((ID) => ID !== categoryId));
    } else {
      setItemCategoriesIds([...ItemCategoriesIds, categoryId]);
    }
  };


return (
  <div>
    <h2>Welcome to the Home page!</h2>
    <form>
      <Link to="/user">
        <button type="button">Go to User Page</button>
      </Link>
      <label htmlFor="sort">Sort By:</label>
        <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="created_at">Created At</option>
          <option value="updated_at">Updated At</option>
        </select>

        <label htmlFor="order">Order:</label>
        <select id="order" value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      <label>Item Categories:</label>
        {itemCategoriesData && itemCategoriesData.map((category: ItemCategory) => (
          <label key={category.ID}>
            <input
              type="checkbox"
              value={category.ID}
              checked={ItemCategoriesIds.includes(category.ID)}
              onChange={() => handleItemCategoriesCheckboxChange(category.ID)}
            />
            {category.Name}
          </label>
        ))}
      <div>
      <label>Curriculum IDs:</label>
      {/* {curriculumData && curriculumData.map((curriculum) => ( */}
        <CurriculumCheckbox
          // key={curriculum.id}
          // curriculum={{ id: curriculum.id, name: curriculum.name }} // Pass the curriculum object
          selectedCurriculumIds={selectedCurriculumIds}
          onCheckboxChange={handleCheckboxChange}
        />

    </div>
      <button type="button" onClick={handleApplyFilters}>
        Apply Filters
      </button>
      <button type="button" onClick={handleCreateItem}>
        Create Item
      </button>
      < Logout />
    </form>

    <ul>
      {data.map((item) => (
        <li key={item.ID}>
          <Link to={`/item/${item.ItemCategoriesName}/${item.ID}`}>
            <button>
              User ID: {item.UserFirebaseUID} <br />
              Title: {item.Title} <br />
              Author: {item.Author} <br />
              Link: {item.Link} <br />
              Likes: {item.Likes} <br />
              Item Category: {item.ItemCategoriesName} <br />
              Created At: {item.CreatedAt} <br />
              Updated At: {item.UpdatedAt} <br />
              Curriculum ID: {item.CurriculumID} <br />
              Curriculum IDs: {item.CurriculumIDs.join(', ')}
            </button>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
};

export default Home;
