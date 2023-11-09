import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Item } from '../../interfaces/Item';

const SearchItem: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentInput, setCurrentInput] = useState<string>(''); // Current input in the search box
  const [sortCriteria, setSortCriteria] = useState('created_at'); // Default sort criteria
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order

  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:8000/items/search', {
        words: searchQuery,
        item_categories: 'your item categories',
        curriculum_ids: 'your curriculum IDs',
      });
      setSearchResults(response.data);
    } catch (error) {
      // Handle error
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]); // Empty dependency array for first rendering  

  const sortResults = () => {
    const sortedResults = [...searchResults];
    sortedResults.sort((a, b) => {
      let comparison = 0;
      if (sortOrder === 'asc') {
        if (sortCriteria === 'created_at') {
          comparison = a.CreatedAt.localeCompare(b.CreatedAt);
        } else if (sortCriteria === 'updated_at') {
          comparison = a.UpdatedAt.localeCompare(b.UpdatedAt);
        } else if (sortCriteria === 'likes') {
          comparison = a.Likes - b.Likes;
        }
      } else {
        if (sortCriteria === 'created_at') {
          comparison = b.CreatedAt.localeCompare(a.CreatedAt);
        } else if (sortCriteria === 'updated_at') {
          comparison = b.UpdatedAt.localeCompare(a.UpdatedAt);
        } else if (sortCriteria === 'likes') {
          comparison = b.Likes - a.Likes;
        }
      }
      return comparison;
    });
  
    setSearchResults(sortedResults);
  };

  const handleApplyFilter = () => {
    sortResults(); // Apply the sort when "Apply Filter" button is clicked
  };

  const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        setSearchQuery(event.currentTarget.value);
      sortResults(); // Apply the sort when Enter key is pressed
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortCriteria(event.target.value as keyof Item);
  };

  const handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(event.target.value);
  };

  return (
    <div>
      <h1>Search Results</h1>
      <div>
        <label>Sort by:</label>
        <select value={sortCriteria} onChange={handleSortChange}>
          <option value="created_at">Created At</option>
          <option value="updated_at">Updated At</option>
          <option value="likes">Likes</option>
        </select>
        <select value={sortOrder} onChange={handleOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <input
          type="text"
          placeholder="Enter search query"
          value={currentInput}
          onChange={handleSearchInputChange}
          onKeyPress={handleEnterKeyPress}
        />
        <button onClick={handleApplyFilter}>Apply Filter</button>
      </div>
      <ul>
        {searchResults.map((result) => (
          <li key={result.Id}>
            <Link
              to={{
                pathname: `/item/${result.ItemCategoriesName}/${result.Id}`,
              }}
              target="_blank"
            >
              <button>
                User ID: {result.UserFirebaseUID} <br />
                Title: {result.Title} <br />
                Author: {result.Author} <br />
                Link: {result.Link} <br />
                Likes: {result.Likes} <br />
                Item Category: {result.ItemCategoriesName} <br />
                Created At: {result.CreatedAt} <br />
                Updated At: {result.UpdatedAt} <br />
                {result.CurriculumIds && result.CurriculumIds.length > 0 && (
                  <>
                    Curriculum IDs: {result.CurriculumIds.join(', ')}
                    <br />
                  </>
                )}
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchItem;
