import {StoreCategory, StoreNamesArray} from "@data/interfaces/interfaces";

class Store {
  category: StoreCategory = StoreCategory.NonFootStore;
  isFavourite: boolean = false;

  constructor(public name: typeof StoreNamesArray[number]) {
    this.category = this.getCategoryForStoreName(name);
  }

  private getCategoryForStoreName(name: typeof StoreNamesArray[number]): StoreCategory {
    switch (name) {
      case 'Adeg':
      case 'Billa':
      case 'Billa+':
      case 'Hofer':
      case 'MPreis':
      case 'Norma':
      case 'Penny':
      case 'Spar':
      case 'Unimarkt':
      case 'T&G':
        return StoreCategory.GroceryStore;
      case 'Bipa':
      case 'Dm':
      case 'Müller':
        return StoreCategory.Drugstore;
      case 'MediaMarkt':
        return StoreCategory.ElectronicsStore;
      case 'Obi':
      case 'Hornbach':
      case 'Lagerhaus':
        return StoreCategory.DIYStore;
      case 'Hervis':
      case 'Intersport':
        return StoreCategory.SportsRetailer;
      case 'Lutz':
      case 'Möbelix':
        return StoreCategory.FurnitureStore;
      case 'Peek&Cloppenburg':
      case 'H&M':
        return StoreCategory.ClothingStore;
      case 'Gruber':
        return StoreCategory.Butcher;
      case 'Action':
      case 'Tedi':
      case 'Pagro':
      case 'TKMaxx':
      default:
        return StoreCategory.NonFootStore;
    }
  }

  getCategoryImagePath(): string {
    switch (this.category) {
      case StoreCategory.GroceryStore:
        return 'assets/images/categories/apple.png';
      case StoreCategory.Drugstore:
        return 'assets/images/categories/bag.png';
      case StoreCategory.FurnitureStore:
        return 'assets/images/categories/box.png';
      case StoreCategory.DIYStore:
        return 'assets/images/categories/wrench.png';
      case StoreCategory.Butcher:
        return 'assets/images/categories/meat.png';
      case StoreCategory.ElectronicsStore:
        return 'assets/images/categories/pc.png';
      case StoreCategory.SportsRetailer:
        return 'assets/images/categories/medal.png';
      case StoreCategory.ClothingStore:
        return 'assets/images/categories/bag.png';
      case StoreCategory.NonFootStore:
      default:
        return 'assets/images/categories/cart.png';
    }
  }

  getColorCode(): string {
    switch (this.category) {
      case StoreCategory.GroceryStore:
        return '#B9FBC0';
      case StoreCategory.Drugstore:
        return '#F1C0E8';
      case StoreCategory.FurnitureStore:
        return '#FBF8CC';
      case StoreCategory.DIYStore:
        return '#FDE4CF';
      case StoreCategory.Butcher:
        return '#FFCFD2';
      case StoreCategory.ElectronicsStore:
        return '#90DBF4';
      case StoreCategory.SportsRetailer:
        return '#A3C4F3';
      case StoreCategory.ClothingStore:
        return '#CFBAF0';
      case StoreCategory.NonFootStore:
      default:
        return '#8EECF5';
    }
  }
}

export default Store;
