import List from "@shared/models/List";
import {
  Article,
  ArticleCategoryArray,
  FirestoreStore,
  StoreCategory,
  SuggestedArticle
} from "@data/interfaces/interfaces";
import Store from "@shared/models/Store";
import {User} from "@angular/fire/auth";

export const listConverter = {
  toFirestore: (list: List) => {
    return {
      name: list.name,
      color: list.color,
      createdBy: list.createdBy,
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    const list = new List(data.name, [], data.color);
    list.createdBy = data.createdBy;
    list.docId = snapshot.id;
    return list;
  }
};

export const articleConverter = {
  toFirestore: (article: Article) => {
    return {
      name: article.name,
      checked: article.checked,
      inSale: article.inSale,
      buyWithDiscount: article.buyWithDiscount,
      validFrom: article.validFrom,
      validUntil: article.validUntil,
      category: article.category,
      amount: article.amount,
      store: article.store.name,
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    const article: Article = {
      name: data.name,
      checked: data.checked,
      checkedTimestamp: data.checkedTimestamp,
      inSale: data.inSale,
      buyWithDiscount: data.buyWithDiscount,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
      category: data.category,
      amount: data.amount,
      store: new Store(data.store),
      docId: snapshot.id,
    };
    return article;
  }
};

export const suggestedArticlesConverter = {
  toFirestore: (suggestedArticle: SuggestedArticle[]) => {
    const data: { items: SuggestedArticle[] } = {
      items: [],
    };

    suggestedArticle.forEach((suggestedArticle: SuggestedArticle) => {
      data.items.push({
        name: suggestedArticle.name,
        category: suggestedArticle.category,
        store: suggestedArticle.store,
        storeCategory: suggestedArticle.storeCategory,
      });
    });

    return data;
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    const result: SuggestedArticle[] = [];
    data.items.forEach((fsStore: SuggestedArticle) => {
      result.push(fsStore);
    });

    return result;
  }
};

export const storeConverter = {
  toFirestore: (stores: Store[]) => {
    const data: { items: FirestoreStore[] } = {
      items: [],
    };

    stores.forEach((store: Store) => {
      data.items.push({
        name: store.name,
        category: store.category,
        isFavourite: store.isFavourite,
      });
    });
    return data;
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    const result: Store[] = [];
    data.items.forEach((fsStore: FirestoreStore) => {
      const store: Store = new Store(fsStore.name);
      if (fsStore.category) {
        store.category = fsStore.category as StoreCategory;
      }
      store.isFavourite = fsStore.isFavourite;
      result.push(store);
    });
    return result;
  }
};

export const articleCategoryConverter = {
  toFirestore: (articleCategories: typeof ArticleCategoryArray[number][]) => {
    const data: { items: typeof ArticleCategoryArray[number][] } = {
      items: [],
    };

    articleCategories.forEach((articleCategory: typeof ArticleCategoryArray[number]) => {
      data.items.push(articleCategory);
    });
    return data;
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    const result: typeof ArticleCategoryArray[number][] = [];
    data.items.forEach((articleCategory: typeof ArticleCategoryArray[number]) => {
      result.push(articleCategory);
    });
    return result;
  }
};
