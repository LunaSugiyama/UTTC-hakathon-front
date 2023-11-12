import React, { useState, useEffect } from 'react';
import { Link , useLocation } from 'react-router-dom';
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
  const [itemCategoriesData, setItemCategoriesData] = useState<ItemCategory[]>([]); // Initialize as an empty array
  const [page, setPage] = useState(1);
  const [page_size, setPage_size] = useState(10);

  const location = useLocation();

  const [selectedCurriculumIds, setSelectedCurriculumIds] = useState<number[]>([]);

  const fetchData = () => {
    setData([]); // Clear the data before fetching new data

    axios
      .get(
        `https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app/items/showall?sort=${sort}&order=${order}&item_categories=${ItemCategoriesIds.join(',')}&curriculum_ids=${selectedCurriculumIds.join(',')}&page=${page}&page_size=${page_size}`, {
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
      .get(`https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app/curriculums/showall`, {
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
      .get(`https://uttc-hackathon-back1-lv2ftadd7a-uc.a.run.app/item_categories/showall`, {
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
      setPage(1); // Reset the page to 1
    
      // Update the URL query parameters
      const params = new URLSearchParams(location.search);
      params.set('sort', sort);
      params.set('order', order);
      params.set('category', ItemCategoriesIds.join(','));
      params.set('page', String(page));
      params.set('page_size', String(page_size));
      console.log('item_categories(appliedFilter)', ItemCategoriesIds.join(',') );

    
      // Replace the URL without causing a full page reload
      window.history.replaceState({}, '', `${location.pathname}?${params}`);
      fetchData();
    };


  const handleCreateItem = () => {
    window.location.href = '/item/create-item';
  }

  useEffect(() => {
    
    const params = new URLSearchParams(location.search);
    const sortParam = params.get('sort');
    const orderParam = params.get('order');
    const categoryParam = params.get('category');
    console.log('categoryParam(useEffect)', categoryParam);
    const pageParam = params.get('page');
    const page_sizeParam = params.get('page_size');
    window.history.replaceState({}, '', `${location.pathname}?${params}`);
    // Initialize your state with the URL parameters
    setSort(sortParam || 'created_at');
    setOrder(orderParam || 'asc');
    setItemCategoriesIds(categoryParam ? categoryParam.split(',').map(Number) : []);
    console.log('item_categories(useEffect)', ItemCategoriesIds.join(',') );
    setPage(Number(pageParam) || 1);
    setPage_size(Number(page_sizeParam) || 10);
    setData([]); // Clear the data before fetching new data
    fetchCurriculumData(); // Fetch curriculum data when the component mounts
    fetchItemCategories(); // Fetch item categories when the component mounts
    // handleApplyFilters();
    fetchData(); // Fetch data when the component mounts
  }, [location.search, page]); // Moved the curriculum data fetching to a useEffect


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

  const handlePageChange = (page: number) => {
    console.log(page);
    setPage(page);
    setData([]); // Clear the data before fetching new data
    fetchData();
  }


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
      {itemCategoriesData !== null ? (
        itemCategoriesData.map((category: ItemCategory) => (
          <label key={category.ID}>
            <input
              type="checkbox"
              value={category.ID}
              checked={ItemCategoriesIds.includes(category.ID)}
              onChange={() => handleItemCategoriesCheckboxChange(category.ID)}
            />
            {category.Name}
          </label>
        ))
      ) : (
        <p>Loading item categories...</p> // You can add a loading indicator here
      )}
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
  {data && data.map((item) => (
    <li key={item.ID}>
      <Link
        to={{
          pathname: `/item/${item.ItemCategoriesName}/${item.ID}`,
          search: `?sort=${sort}&order=${order}&category=${ItemCategoriesIds.join(',')}&page=${page}&page_size=${page_size}`,
        }}
        target="_blank"
      > 
        <button>
          User ID: {item.UserFirebaseUID} <br />
          Title: {item.Title} <br />
          Author: {item.Author} <br />
          Link: {item.Link} <br />
          Likes: {item.Likes} <br />
          Item Category: {item.ItemCategoriesName} <br />
          Created At: {item.CreatedAt} <br />
          Updated At: {item.UpdatedAt} <br />
          Curriculum IDs: {item.CurriculumIDs.join(', ')}
        </button>
      </Link>
    </li>
  ))}
  {!data && <p>No items available.</p>}
</ul>
    <div>
      <button
        onClick={() => {
          if (page > 1 && data) {
            handlePageChange(page - 1);
          }
        }}
        disabled={page === 1}
      >
        Previous
      </button>
      <span> Page {page} </span>
      <button
        onClick={() => {
          // Check if there's more data to fetch based on page_size
          if (data && data.length === page_size) {
            handlePageChange(page + 1);
          }
        }}
        disabled={data && data.length < page_size}
      >
        Next
      </button>
    </div>
  </div>
);
};

export default Home;
