export interface ItemDetails {
    id: number;
    user_id: number;
    title: string;
    author: string;
    link: string;
    likes: number;
    item_categories_id: number;
    item_categories_name: string;
    explanation: string;
    curriculum_ids: number[];
    is_starred: boolean;
    // Add other properties as needed
  }