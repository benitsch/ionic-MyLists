import {StoreCategory, StoreName} from "@data/interfaces/interfaces";

class Store {
  category: StoreCategory;
  isFavourite: boolean = false;

  constructor(public name: StoreName) {
    this.category = this.getCategoryForStoreName(name);
  }

  private getCategoryForStoreName(name: StoreName): StoreCategory {
    switch (name) {
      case StoreName.Adeg:
      case StoreName.Billa:
      case StoreName.BillaPlus:
      case StoreName.Hofer:
      case StoreName.MPreis:
      case StoreName.Norma:
      case StoreName.Penny:
      case StoreName.Spar:
      case StoreName.Unimarkt:
      case StoreName.TAndG:
        return StoreCategory.GroceryStore;
      case StoreName.Bipa:
      case StoreName.Dm:
      case StoreName.Mueller:
        return StoreCategory.Drugstore;
      case StoreName.MediaMarkt:
        return StoreCategory.ElectronicsStore;
      case StoreName.Obi:
      case StoreName.Hornbach:
      case StoreName.Lagerhaus:
        return StoreCategory.DIYStore;
      case StoreName.Action:
      case StoreName.Tedi:
      case StoreName.Pagro:
      case StoreName.TKMaxx:
        return StoreCategory.NonFootStore;
      case StoreName.Hervis:
      case StoreName.Intersport:
        return StoreCategory.SportsRetailer;
      case StoreName.Lutz:
      case StoreName.Moebelix:
        return StoreCategory.FurnitureStore;
      case StoreName.PeekAndCloppenburg:
      case StoreName.HAndM:
        return StoreCategory.ClothingStore;
      case StoreName.Gruber:
        return StoreCategory.Butcher;
      default:
        throw new Error(`Unknown store name: ${name}`);
    }
  }

  getCategoryImageUrl(): string {
    switch (this.category) {
      case StoreCategory.GroceryStore:
        return 'assets/images/categories/apple.png';
      case StoreCategory.Drugstore:
        return 'assets/images/categories/bag.png';
      case StoreCategory.FurnitureStore:
        return 'assets/images/categories/box.png';
      case StoreCategory.DIYStore:
        return 'assets/images/categories/wrench.png';
      case StoreCategory.NonFootStore:
        return 'assets/images/categories/cart.png';
      case StoreCategory.Butcher:
        return 'assets/images/categories/meat.png';
      case StoreCategory.ElectronicsStore:
        return 'assets/images/categories/pc.png';
      case StoreCategory.SportsRetailer:
        return 'assets/images/categories/medal.png';
      case StoreCategory.ClothingStore:
        return 'assets/images/categories/bag.png';
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
      case StoreCategory.NonFootStore:
        return '#8EECF5';
      case StoreCategory.Butcher:
        return '#FFCFD2';
      case StoreCategory.ElectronicsStore:
        return '#90DBF4';
      case StoreCategory.SportsRetailer:
        return '#A3C4F3';
      case StoreCategory.ClothingStore:
        return '#CFBAF0';
    }
  }
}

export default Store;
