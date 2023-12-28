import Store from "@shared/models/Store";
// import {Timestamp} from "@angular/fire/firestore";
import {FieldValue} from "@firebase/firestore";

export interface Article {
  name: string,
  checked: boolean,
  checkedTimestamp?: FieldValue,
  inSale: boolean,
  buyWithDiscount: boolean,
  validFrom: string|null,
  validUntil: string|null,
  category: typeof ArticleCategoryArray[number],
  amount: number,
  store: Store,
  docId: string,
}

// export interface User {
//   id: string,
//   firstName: string,
//   lastName: string,
//   email: string,
// }

export const ArticleCategoryArray = [
  'Obst & Gemüse',
  'Süßes',
  'Fleisch & Fisch',
  'Getränke',
  'Sonstiges',
] as const;

export const StoreNamesArray: string[] = [
  'Adeg',
  'Spar',
  'Billa',
  'Billa+',
  'Hofer',
  'Penny',
  'Unimarkt',
  'Norma',
  'MPreis',
  'T&G',
  'Bipa',
  'Dm',
  'Müller',
  'MediaMarkt',
  'Obi',
  'Hornbach',
  'Lagerhaus',
  'Lutz',
  'Möbelix',
  'Hervis',
  'Intersport',
  'Peek & Cloppenburg',
  'H&M',
  'Action',
  'Tedi',
  'Pagro',
  'TK MAxx',
  'Gruber',
];


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

export interface FirestoreStore {
  name: typeof StoreNamesArray[number],
  isFavourite: boolean,
  category: string,
}

export type SuggestedArticle = {
  name: string,
  category?: typeof ArticleCategoryArray[number],
  store?: typeof StoreNamesArray[number],
  storeCategory?: StoreCategory,
}
