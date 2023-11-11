export interface Comment {
    id: number;
    item_id: number;
    item_categories_id: number;
    user_firebase_uid: string;
    name: string;
    comment: string;
    created_at: string;
    updated_at: string;
  }