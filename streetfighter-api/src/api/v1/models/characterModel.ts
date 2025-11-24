export interface CharacterCategoryMove {
  name: string;
  [key: string]: any;
}

export interface CharacterCategory {
  categoryName: string;
  categoryId: string;
  moves: CharacterCategoryMove[];
}

export interface Character {
  character: string; // short id like 'ryu'
  url?: string;
  scrapedAt?: string;
  categories?: CharacterCategory[];
  [key: string]: any;
}
