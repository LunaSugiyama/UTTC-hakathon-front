export interface Item {
    UniqueId: string;
    ID: number;
    UserFirebaseUID: number;
    Title: string;
    Author: string;
    Link: string;
    Likes: number;
    ItemCategoriesID: number;
    ItemCategoriesName: string;
    Explanation: string;
    CurriculumIDs: number[];
    IsStarred: boolean;
    Images: string[];
    CreatedAt: string;
    UpdatedAt: string;
    // Add other properties as needed
  }
  