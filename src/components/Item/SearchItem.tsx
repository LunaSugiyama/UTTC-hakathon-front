import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { Item } from '../../interfaces/Item';
import CurriculumCheckbox from '../curriculum/Checkbox';
import { ItemCategory } from '../../interfaces/ItemCategory';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookIcon from '@mui/icons-material/Book';
import BlogIcon from '@mui/icons-material/Article'; // Example icon for blogs
import VideoIcon from '@mui/icons-material/OndemandVideo';
import Layout from '../../item/layout/Layout';
import Tree from '../../item/tree4.png';
import getIconForCategory from '../../item/icons/GetIconForCategory';
import { accordionStyle, accordionSummaryStyle, accordionDetailsStyle } from '../curriculum/Checkbox';

// MUI
import { Button, FormControlLabel, List, ListItem, ListItemText, Paper, ThemeProvider, createTheme, TextField, Select, MenuItem, SelectChangeEvent, Container,
Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Box } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
const theme = createTheme({
    palette: {
      primary: {
        main: '#4caf50', // Main green color
        light: '#81c784', // Lighter green
        dark: '#388e3c', // Darker green
      },
      secondary: {
        main: '#66bb6a', // Another shade of green
        // ... more colors as needed
      },
      // ... other palette options
    },
    // ... other theme customizations
  });
  

interface Curriculum {
    id: number;
    name: string;
}

const SearchItem: React.FC = () => {
    const [searchResults, setSearchResults] = useState<Item[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortedResults, setSortedResults] = useState<Item[]>([]);
    const [sortCriteria, setSortCriteria] = useState('updated_at.desc'); // Default sort criteria
    const [selectedCurriculumIds, setSelectedCurriculumIds] = useState<number[]>([]);
    const [curriculumData, setCurriculumData] = useState<Curriculum[]>([]);
    const [ItemCategoriesIds, setItemCategoriesIds] = useState<number[]>([]);
    const [itemCategoriesData, setItemCategoriesData] = useState<ItemCategory[]>([]); // Initialize as an empty array
    const [showItems, setShowItems] = useState<Boolean>(false); // Initialize as an empty array
    const token = Cookies.get('token');

    useEffect(() => {
        console.log('searchresults', searchResults, 'sortcriteria', sortCriteria, 'selectedcurriculumids', selectedCurriculumIds, 'itemcategoriesids', ItemCategoriesIds)
        console.log('showitems', showItems, 'sortedresults', sortedResults)
    }, [searchResults, selectedCurriculumIds, ItemCategoriesIds, showItems, sortedResults]);

    useEffect(() => {
        const fetchCurriculumData = async () => {
            try {
                const response = await axios.get('https://uttc-hakathon-front.vercel.app/curriculums/showall', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurriculumData(response.data);
            } catch (error) {
                console.error('Error fetching curriculum data:', error);
            }
        };

        fetchCurriculumData();
    }, []);

    useEffect(() => {
        setSearchResults([]); // Clear search results when the search query changes
        const fetchData = async () => {
          try {
            const response = await axios.post('https://uttc-hakathon-front.vercel.app/items/search', {
              words: searchQuery,
              curriculum_ids: selectedCurriculumIds.join(','),
            });
            // Ensure the response data is an array of Items
            const items: Item[] = response.data;
            // Add a unique id to each item using the index from the map function
            const resultsWithUniqueId = items.map((item, index) => {
              // Here, item is already typed as Item, and index is a number
              return { ...item, UniqueId: `unique-${index}` }; // uniqueId is now a string to ensure uniqueness
            });
            setSearchResults(resultsWithUniqueId);
            applyFilterAndSort();
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, [searchQuery]);      

    useEffect(() => {
        const fetchItemCategories = () => {
            axios
              .get(`https://uttc-hakathon-front.vercel.app/item_categories/showall`, {
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
            fetchItemCategories();
    }, []);

    type ValidSortKeys = 'likes' | 'created_at' | 'updated_at';
    const applyFilterAndSort = () => {
        console.log('sortcriteria', sortCriteria, 'selectedcurriculumids', selectedCurriculumIds, 'itemcategoriesids', ItemCategoriesIds)
        let filteredResults = searchResults;

        // Filter by selected curriculum IDs if any are selected
        if (selectedCurriculumIds && selectedCurriculumIds.length > 0) {
          filteredResults = filteredResults.filter(item =>
            selectedCurriculumIds.some(id => item.curriculum_ids?.includes(id))
          );
        }

        // Then, if there are selected item category IDs, filter by them as well
        if (ItemCategoriesIds.length > 0) {
            filteredResults = filteredResults.filter(item =>
            ItemCategoriesIds.includes(item.item_categories_id) // Assuming each item has a CategoryID property
            );
        }

        const [criteria, order] = sortCriteria.split(".") as [ValidSortKeys, "asc" | "desc"];
        console.log('criteria', criteria, 'order', order)
        const sortOrder = order === "desc" ? -1 : 1;
    
        // Check if the criteria is a valid sort key
        if (!['likes', 'created_at', 'updated_at'].includes(criteria)) {
            console.error(`Invalid sort criteria: ${criteria}`);
            return;
        }

        const sorted = filteredResults.sort((a, b) => {
            const aValue = a[criteria];
            const bValue = b[criteria];
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 1 ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 1 ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
    
        console.log(sorted);
        setSortedResults(sorted);
    };

    const resetFiltersAndSort = (sort_criteria: keyof Item = 'created_at', sort_order: 'asc' | 'desc' = 'desc') => {
        setSearchQuery(''); // Clears the search query
        setSortedResults([]); // Clears the sorted results
        setSelectedCurriculumIds([]); // Clears selected curriculum IDs
        setItemCategoriesIds([]); // Clears selected item category IDs
        setSortCriteria(sort_criteria); // Sets sort criteria to given parameter or default
    };   

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setSearchQuery(event.target.value);
        console.log(searchQuery);
      };
      

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string; // Assuming sort criteria is always a string
        setSortCriteria(value);
      };

    const handleCheckboxChange = (id: number) => {
        setSelectedCurriculumIds(prevSelected =>
            prevSelected.includes(id) ? prevSelected.filter(curriculumId => curriculumId !== id) : [...prevSelected, id]
        );
    };  

    const handleApplyFilter = () => {
        applyFilterAndSort();
        // resetFiltersAndSort(sortCriteria, sortOrder);
        setShowItems(!showItems);
    }

    const handleResetFiltersAndSort = () => {
        resetFiltersAndSort();
    }

    const handleCreateItem = () => {
        window.location.href = '/item/create-item';
      }


      const [expanded, setExpanded] = useState<string | false>(false);
      const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
          setExpanded(isExpanded ? panel : false);
      };
    
      const [expandedAccordions, setExpandedAccordions] = useState<{ [key: string]: boolean }>({});
    
      // Function to toggle accordion expansion
      const handleAccordionToggle = (id: string) => (event: React.SyntheticEvent) =>{
        setExpandedAccordions(prevState => ({
          ...prevState,
          [id]: !prevState[id]
        }));
      };

    const handleItemCategoriesCheckboxChange = (categoryId: number) => {
        setItemCategoriesIds((prevItemCategoriesIds) => {
            if (prevItemCategoriesIds.includes(categoryId)) {
                // If the category is already selected, remove it from the array
                return prevItemCategoriesIds.filter((id) => id !== categoryId);
            } else {
                // Otherwise, add the category to the array
                return [...prevItemCategoriesIds, categoryId];
            }
        });
    };    

    return (
        <Layout>
        < ThemeProvider theme={theme}>
        <Container maxWidth="lg" style={{ margin: 'auto' }}>
            <Paper style={{ backgroundColor: '#E6F2DA', padding: '20px', margin: '20px 0' }}>
        <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <img 
        src={Tree} // Make sure this import is correctly pointing to your image file
        alt="Tree"
        style={{ alignSelf: 'center', height: '400px', margin: '20px' }} // Adjust size as needed
    />       
            <div>
              <Select value={sortCriteria} onChange={handleSortChange} label="Sort by" style={{ color: '#004d40' }}>                   <MenuItem value="CreatedAt_desc">Newest Created</MenuItem>
                    <MenuItem value="created_at.asc"> Oldest Created</MenuItem>
                    <MenuItem value="updated_at.desc"> Newest Updated</MenuItem>
                    <MenuItem value="updated_at.asc"> Oldest Updated</MenuItem>
                    <MenuItem value="likes.desc">Likes</MenuItem>
                </Select>
                <CurriculumCheckbox
                    selectedCurriculumIds={selectedCurriculumIds}
                    onCheckboxChange={handleCheckboxChange}
                />
                <Accordion
                style={accordionStyle}>
                <AccordionSummary
                        style={accordionSummaryStyle}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="curriculum-options-content"
                        id="curriculum-options-header"
                      >
                        <BlogIcon />
                        <h3>Item Categories:</h3>
                      </AccordionSummary>
                      <AccordionDetails
                      style={accordionDetailsStyle}>
                    {itemCategoriesData !== null ? (
                        itemCategoriesData.map((category: ItemCategory) => (
                            <FormControlLabel
                            key={category.ID}
                            control={
                              <Checkbox
                                checked={ItemCategoriesIds.includes(category.ID)}
                                onChange={() => handleItemCategoriesCheckboxChange(category.ID)}
                              />
                            }
                            label={category.Name}
                          />
                        ))
                    ) : (
                    <p>Loading item categories...</p> // You can add a loading indicator here
                )}
                </AccordionDetails>
                </Accordion>
                <div>
                <TextField
                    type="text"
                    placeholder="Enter search query"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    variant="outlined"
                    margin="normal"
                />
                </div>
                <Button variant="contained" style={{ backgroundColor: '#81c784', color: 'white'}} onClick={handleApplyFilter}>Apply Filter</Button>
                <Button type="button" onClick={handleResetFiltersAndSort}>
                    Reset Filters
                </Button>
            </div>
            </div>
            <Paper style={{ backgroundColor: '#F5F5F5', padding: '20px', margin: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={{ marginRight: '20px' }}>Search Results</h2>
            <Button 
              variant="contained" 
              style={{ backgroundColor: '#81c784', color: 'white' }} 
              onClick={handleCreateItem}
            >
              Create Item
            </Button>
          </div>
          <List>
                    {sortedResults.map((result) => (
                        <Accordion 
                        expanded={expandedAccordions[ `panel-${result.UniqueId}`]}
                        onChange={() => handleAccordionToggle(`panel-${result.UniqueId}`)}
                          key={result.UniqueId} 
                          style={{ backgroundColor: '#ffffff', margin: '10px 0' }}
                        >
                            <AccordionSummary
                                expandIcon={
                                  <IconButton onClick={() => handleAccordionToggle(`panel-${result.UniqueId}`)}>
                                  <ExpandMoreIcon />
                                  </IconButton>
                                }
                                aria-controls={`panel-${result.UniqueId}-content`}
                                id={`panel-${result.UniqueId}-header`}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      {typeof result.item_categories_name === 'string' ? getIconForCategory(result.item_categories_name.toLowerCase()) : null}
                                      <Typography sx={{ ml: 1 }}>{result.title}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{ mr: 1 }}>{result.updated_at}</Typography>
                                        <FavoriteIcon />
                                        <Typography sx={{ ml: 1 }}>{result.likes}</Typography>
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                      <table>
                        <tbody>
                          <tr>
                            <td>User ID:</td>
                            <td style={{ textAlign: 'left', paddingLeft: '20px' }}>{result.user_firebase_uid}</td>
                          </tr>
                          <tr>
                            <td>Title:</td>
                            <td style={{ textAlign: 'left', paddingLeft: '20px' }}>{result.title}</td>
                          </tr>
                          <tr>
                            <td>Author:</td>
                            <td style={{ textAlign: 'left', paddingLeft: '20px' }}>{result.author}</td>
                          </tr>
                          <tr>
                            <td>Link:</td>
                            <td style={{ textAlign: 'left', paddingLeft: '20px' }}>
                              <a href={result.link} target="_blank" rel="noopener noreferrer">
                                {result.link}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>Item Category:</td>
                            <td style={{ textAlign: 'left', paddingLeft: '20px' }}>{result.item_categories_name}</td>
                          </tr>
                          <tr>
                            <td>Created At:</td>
                            <td style={{ textAlign: 'left', paddingLeft: '20px' }}>{result.created_at}</td>
                          </tr>
                          <tr>
                            <td>Updated At:</td>
                            <td style={{ textAlign: 'left', paddingLeft: '20px' }}>{result.updated_at}</td>
                          </tr>
                          {result.curriculum_ids && result.curriculum_ids.length > 0 && (
                            <tr>
                              <td>Curriculum IDs:</td>
                              <td style={{ textAlign: 'left', paddingLeft: '20px' }}>{result.curriculum_ids.join(', ')}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </Typography>                     
                              </AccordionDetails>
                              <Button
                                variant="contained"
                                style={{ backgroundColor: '#000000', color: '#ffffff', padding: '10px', marginBottom: '20px', marginLeft: '20px' }}
                                onClick={() => window.open(`/item/${result.item_categories_name}/${result.id}`, '_blank')}
                                >
                                View Item
                            </Button>
                        </Accordion>
                    ))}
                </List>
            </Paper>
        </div>
        </Paper>
        </Container>
        </ThemeProvider>
        </Layout>
    );
};

export default SearchItem;
