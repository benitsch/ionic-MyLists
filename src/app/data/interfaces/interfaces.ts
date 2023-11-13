// export interface List {
//   id: string,
//   name: string,
//   articles: Article[],
//   users: User[],
// }

import Store from "@shared/models/Store";

export interface Article {
  name: string,
  checked: boolean,
  inSale: boolean,
  buyWithDiscount: boolean,
  validFrom: string|null,
  validUntil: string|null,
  category: ArticleCategory,
  amount: number,
  store: Store,
}

export interface User {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
}

export enum ArticleCategory {
  FruitAndVegetables = 'Obst & Gemüse',
  Sweets = 'Süßes',
  MeatAndFish = 'Fleisch & Fisch',
  Beverages = 'Getränke',
  Other = 'Sonstiges',
}

// export interface Store {
//   name: StoreName,
//   category: StoreCategory,
// }

export enum StoreName {
  Adeg = 'Adeg',
  Spar = 'Spar',
  Billa = 'Billa',
  BillaPlus = 'Billa+',
  Hofer = 'Hofer',
  Penny = 'Penny',
  Unimarkt = 'Unimarkt',
  Norma = 'Norma',
  MPreis = 'MPreis',
  TAndG = 'T&G',
  Bipa = 'Bipa',
  Dm = 'Dm',
  Mueller = 'Müller',
  MediaMarkt = 'MediaMarkt',
  Obi = 'Obi',
  Hornbach = 'Hornbach',
  Lagerhaus = 'Lagerhaus',
  Lutz = 'Lutz',
  Moebelix = 'Möbelix',
  Hervis = 'Hervis',
  Intersport = 'Intersport',
  PeekAndCloppenburg = 'Peek & Cloppenburg',
  HAndM = 'H&M',
  Action = 'Action',
  Tedi = 'Tedi',
  Pagro = 'Pagro',
  TKMaxx = 'TK MAxx',
  Gruber = 'Gruber',
}

export enum StoreCategory {
  GroceryStore = 'Lebensmittelladen',
  Drugstore = 'Drogerie',
  FurnitureStore = 'Möbelhaus',
  DIYStore = 'Baumarkt',
  NonFootStore = 'Markt',
  Butcher = 'Fleischer',
  ElectronicsStore = 'Elektronikfachmarkt',
  SportsRetailer = 'Sportfachhandel',
  ClothingStore = 'Kleiderladen',
}

export interface StoreArticles {
  [storeName: string]: CategoryArticles;
}

export interface CategoryArticles {
  [categoryName: string]: Article[];
}
