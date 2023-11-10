import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { Item } from '../../interfaces/Item';
import CurriculumCheckbox from '../curriculum/Checkbox';
import { set } from 'firebase/database';

interface Curriculum {
    id: number;
    name: string;
}

const SearchItem: React.FC = () => {
    const [searchResults, setSearchResults] = useState<Item[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortedResults, setSortedResults] = useState<Item[]>([]);
    const [sortCriteria, setSortCriteria] = useState<keyof Item>('CreatedAt'); // Default sort criteria
    const [sortOrder, setSortOrder] = useState('asc'); // Default sort order
    const [selectedCurriculumIds, setSelectedCurriculumIds] = useState<number[]>([]);
    const [curriculumData, setCurriculumData] = useState<Curriculum[]>([]);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchCurriculumData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/curriculums/showall', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurriculumData(response.data);
                setSelectedCurriculumIds(response.data.map((curriculum: Curriculum) => curriculum.id)); // Typed parameter (fix for error 1)
            } catch (error) {
                console.error('Error fetching curriculum data:', error);
            }
        };

        fetchCurriculumData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.post('http://localhost:8000/items/search', {
              words: searchQuery,
              curriculum_ids: selectedCurriculumIds.join(','),
            });
            // Ensure the response data is an array of Items
            const items: Item[] = response.data;
            // Add a unique id to each item using the index from the map function
            const resultsWithUniqueId = items.map((item, index) => {
              // Here, item is already typed as Item, and index is a number
              return { ...item, uniqueId: `unique-${index}` }; // uniqueId is now a string to ensure uniqueness
            });
            setSearchResults(resultsWithUniqueId);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, [searchQuery, selectedCurriculumIds]);      

    const applyFilterAndSort = () => {
        const filteredResults = searchResults.filter(item =>
            selectedCurriculumIds.some(id => item.CurriculumIDs?.includes(id)) 
            );

        const sorted = filteredResults.sort((a, b) => {
            const aValue = a[sortCriteria];
            const bValue = b[sortCriteria];
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
        setSortedResults(sorted);
        console.log(sortedResults)
    };

    useEffect(() => {
        applyFilterAndSort();
    }, [searchResults, sortCriteria, sortOrder, selectedCurriculumIds]);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortCriteria(event.target.value as keyof Item);
    };

    const handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(event.target.value);
    };

    const handleCheckboxChange = (id: number) => {
        setSelectedCurriculumIds(prevSelected =>
            prevSelected.includes(id) ? prevSelected.filter(curriculumId => curriculumId !== id) : [...prevSelected, id]
        );
    };

    return (
        <div>
            <h1>Search Results</h1>
            <div>
                <label>Sort by:</label>
                <select value={sortCriteria} onChange={handleSortChange}>
                    <option value="CreatedAt">Created At</option>
                    <option value="UpdatedAt">Updated At</option>
                    <option value="Likes">Likes</option>
                </select>
                <select value={sortOrder} onChange={handleOrderChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                <CurriculumCheckbox
                    selectedCurriculumIds={selectedCurriculumIds}
                    onCheckboxChange={handleCheckboxChange}
                />
                <input
                    type="text"
                    placeholder="Enter search query"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
                <button onClick={() => applyFilterAndSort()}>Apply Filter</button>
            </div>
            <ul>
                {sortedResults.map((result) => (
                    <li key={result.UniqueId}>
                        <Link to={`/item/${result.ItemCategoriesName}/${result.ID}`} target="_blank">
                            <button>
                                User ID: {result.UserFirebaseUID} <br />
                                Title: {result.Title} <br />
                                Author: {result.Author} <br />
                                Link: {result.Link} <br />
                                Likes: {result.Likes} <br />
                                Item Category: {result.ItemCategoriesName} <br />
                                Created At: {result.CreatedAt} <br />
                                Updated At: {result.UpdatedAt} <br />
                                {result.CurriculumIDs && result.CurriculumIDs.length > 0 && (
                                    <>
                                        Curriculum IDs: {result.CurriculumIDs.join(', ')}
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
