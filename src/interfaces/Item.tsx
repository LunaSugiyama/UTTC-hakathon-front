export interface Item {
    UniqueId: string;
    id: number;
    user_firebase_uid: number;
    title: string;
    author: string;
    link: string;
    likes: number;
    item_categories_id: number;
    item_categories_name: string;
    explanation: string;
    curriculum_ids: number[];
    is_starred: boolean;
    images: string[];
    created_at: string;
    updated_at: string;
    similarity: number;
    // Add other properties as needed
  }
  