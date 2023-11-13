import {Injectable} from '@angular/core';
import Store from '@app/shared/models/Store';
import List from '@app/shared/models/List';
import {ArticleCategory, StoreName, User} from "@data/interfaces/interfaces";


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public lists: List[] = [];

  constructor() {
    const testArticleObj = {
      name: "Obst A",
      checked: false,
      inSale: false,
      validFrom: null,
      validUntil: null,
      buyWithDiscount: false,
      category: ArticleCategory.FruitAndVegetables,
      amount: 1,
      store: new Store(StoreName.Spar),
    };
    const testArticleObj2 = {
      name: "Gemüse B ansddnsnsjdidisisjsjdiajsssssaabcdasdfdfdsszzzzzzzzz",
      checked: false,
      inSale: false,
      validFrom: new Date().toISOString(),
      validUntil: new Date().toISOString(),
      buyWithDiscount: false,
      category: ArticleCategory.FruitAndVegetables,
      amount: 1,
      store: new Store(StoreName.Spar),
    };
    const testArticleObj3 = {
      name: "Süßes C",
      checked: false,
      inSale: true,
      validFrom: null,
      validUntil: new Date().toISOString(),
      buyWithDiscount: false,
      category: ArticleCategory.Sweets,
      amount: 1,
      store: new Store(StoreName.Spar),
    };
    const testArticleObj4 = {
      name: "Other D",
      checked: false,
      inSale: false,
      validFrom: new Date().toISOString(),
      validUntil: null,
      buyWithDiscount: true,
      category: ArticleCategory.Other,
      amount: 1,
      store: new Store(StoreName.Billa),
    };
    const testArticleObj5 = {
      name: "Fleisch E",
      checked: false,
      inSale: false,
      validFrom: null,
      validUntil: null,
      buyWithDiscount: true,
      category: ArticleCategory.MeatAndFish,
      amount: 1,
      store: new Store(StoreName.BillaPlus),
    };
    const testArticleObj6 = {
      name: "Fisch F",
      checked: false,
      inSale: false,
      validFrom: new Date().toISOString(),
      validUntil: null,
      buyWithDiscount: false,
      category: ArticleCategory.MeatAndFish,
      amount: 1,
      store: new Store(StoreName.Spar),
    };
    const testUserObj: User = {
      id: "abc-123-id",
      firstName: "Max",
      lastName: "Mustermann",
      email: "max.mustermann@gmail.com"
    };
    const testListObj: List = new List(
      "1",
      "Testliste",
      [testArticleObj, testArticleObj2, testArticleObj3, testArticleObj4, testArticleObj5, testArticleObj6],
      [testUserObj],
    );
    this.lists.push(testListObj);
  }

  public getLists(): List[] {
    return this.lists;
  }

  public getListById(id: number): List {
    return this.lists[id];
  }

  public getArticleSuggestions(): string[] {
    return [
      'Apple',
      'Apricot',
      'Banana',
      'Blackberry',
      'Blueberry',
      'Cherry',
      'Cranberry',
      'Grape',
      'Grapefruit',
      'Guava',
      'Jackfruit',
      'Lime',
      'Mango',
      'Nectarine',
      'Orange',
      'Papaya',
      'Passionfruit',
      'Peach',
      'Pear',
      'Plantain',
      'Plum',
      'Pineapple',
      'Pomegranate',
      'Raspberry',
      'Strawberry',
    ];
  }
}
