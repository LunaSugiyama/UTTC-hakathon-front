import axios from 'axios';
import { Item } from '../../../interfaces/Item'; // Import the Item interface
import Cookies from 'js-cookie';

// Assuming the type of the items array is Item[]
const fetchRelatedItems = async (
  currentItemId: number,
  currentItemCategoriesName: string,
  setRelatedItems: React.Dispatch<React.SetStateAction<Item[]>>
) => {
  const token = Cookies.get('token');
  try {
    const response = await axios.get(`https://uttc-hakathon-front.vercel.app/items/related`, {
      params: { item_id: currentItemId, item_categories_name: currentItemCategoriesName },
      headers: { Authorization: `Bearer ${token}` },
    });
    const relatedItems: Item[] = response.data;
    console.log('related items: ', relatedItems)
    const resultsWithUniqueId = relatedItems.map((item, index) => {
      return { ...item, UniqueId: `unique-${index}` };
    })
    // Assuming the response contains an array of related items
    setRelatedItems(resultsWithUniqueId);
  } catch (error) {
    console.error('Error fetching related items:', error);
  }
};

export default fetchRelatedItems;
