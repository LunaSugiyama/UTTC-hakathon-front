export interface Item {
    Id: number;
    UserFirebaseUID: number;
    Title: string;
    Author: string;
    Link: string;
    Likes: number;
    ItemCategoriesId: number;
    ItemCategoriesName: string;
    Explanation: string;
    CurriculumIds: number[];
    IsStarred: boolean;
    Images: string[];
    CreatedAt: string;
    UpdatedAt: string;
    // Add other properties as needed
  }
  