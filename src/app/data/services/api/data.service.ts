import {inject, Injectable} from '@angular/core';
import Store from '@app/shared/models/Store';
import List from '@app/shared/models/List';
import {Article, ArticleCategoryArray, SuggestedArticle} from "@data/interfaces/interfaces";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  getCountFromServer,
  writeBatch,
  arrayUnion,
} from "@angular/fire/firestore";
import {User} from "@angular/fire/auth";
import {
  ARTICLE_CATEGORIES,
  ARTICLE_CATEGORIES_DOC_ID,
  ARTICLE_CATEGORIES_FIELD_NAME,
  ARTICLES, SHARED_SHOPPING_LISTS,
  SHOPPING_LIST_ARTICLES,
  SHOPPING_LISTS,
  STORES,
  STORES_DEFAULT_DOC_ID,
  STORES_FIELD_NAME,
  SUGGESTED_ARTICLES,
  SUGGESTED_ARTICLES_DOC_ID,
  SUGGESTED_ARTICLES_FIELD_NAME,
  USER_SHOPPING_LISTS, USERS
} from "@data/constants/constants";
import {
  articleCategoryConverter,
  articleConverter,
  listConverter,
  storeConverter,
  suggestedArticlesConverter
} from "@data/converter/converter";
import {AuthService} from "@data/services/authentication/auth.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";


@Injectable({
  providedIn: 'root'
})
export class DataService {

  firestoreDb: Firestore = inject(Firestore);

  constructor(private authService: AuthService,) {
  }

  public async getLists(): Promise<List[]> {
    const result: List[] = [];
    try {
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        return result;
      }
      const querySnapshot = await getDocs(collection(this.firestoreDb, SHOPPING_LISTS, userId, USER_SHOPPING_LISTS).withConverter(listConverter));
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const rsData = doc.data();
        result.push(rsData as List);
      });
    } catch (e) {
      console.error("Error: ", e);
    }

    return result;
  }

  public async getArticleAmountByListId(listId: string): Promise<number> {
    try {
      const coll = collection(this.firestoreDb, ARTICLES, listId, SHOPPING_LIST_ARTICLES);
      const snapshot = await getCountFromServer(coll);

      return snapshot.data().count;
    } catch (e) {
      console.error("Error: ", e);
    }
    return 0;
  }

  public async addList(list: List): Promise<string> {
    try {
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        return '';
      }
      const newDocRef = await addDoc(
        collection(this.firestoreDb, SHOPPING_LISTS, userId, USER_SHOPPING_LISTS)
          .withConverter(listConverter),
        list);
      return newDocRef.id;
    } catch (e) {
      console.error("Error: ", e);
      return '';
    }
  }

  public async addUserToList(list: List, userIdToAdd: string): Promise<boolean> {
    if (await this.userExists(userIdToAdd)) {
      try {
        const docRef = doc(this.firestoreDb, SHOPPING_LISTS, userIdToAdd, USER_SHOPPING_LISTS, list.docId);

        await setDoc(
          docRef.withConverter(listConverter),
          list);
        await this.addUserToSharedShoppingList(list, userIdToAdd);
        return true;
      } catch (e) {
        console.error("Error: ", e);
      }
    }

    return false;
  }

  private async addUserToSharedShoppingList(list: List, userIdToAdd: string): Promise<void> {
    try {
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        return;
      }

      if (list.createdBy === userId) {
        const docRef = doc(this.firestoreDb, SHARED_SHOPPING_LISTS, list.docId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          await updateDoc(docRef, {
            users: arrayUnion(userId, userIdToAdd)
          });
        } else {
          await setDoc(docRef, {
            users: [userId, userIdToAdd],
          });
        }

      }
    } catch (e) {
      console.error("Error: ", e);
    }
  }

  public updateList(list: List): void {
    try {
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        return;
      }
      const docRef = doc(this.firestoreDb, SHOPPING_LISTS, userId, USER_SHOPPING_LISTS, list.docId).withConverter(listConverter);
      setDoc(docRef, list);
    } catch (e) {
      console.error("Error: ", e);
    }
  }

  public deleteList(list: List): void {
    console.log("deleteList:", list.docId);
    // TODO when I'm the owner of a shared list and I delete the list, the list should be deleted in all shared users as well
    try {
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        return;
      }

      const docRef = doc(this.firestoreDb, SHOPPING_LISTS, userId, USER_SHOPPING_LISTS, list.docId);
      if (list.createdBy === userId) {
        this.deleteAllArticles(list.docId);
        // TODO if it is a shared list and I'm the owner, delete from SHARED_SHOPPING_LISTS and delete list from all users within.
        // Atomically remove a region from the "regions" array field.
        // await updateDoc(docRef, {
        //   users: arrayRemove(userIdToAdd)
        // });
      }
      deleteDoc(docRef);
    } catch (e) {
      console.error("Error: ", e);
    }
  }

  private async deleteAllArticles(listId: string): Promise<void> {
    try {
      const articlesCollectionRef = collection(this.firestoreDb, ARTICLES, listId, SHOPPING_LIST_ARTICLES);
      const snapshot = await getDocs(articlesCollectionRef);
      const batch = writeBatch(this.firestoreDb);

      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (e) {
      console.error("Error: ", e);
    }
  }

  public async getListById(listId: string): Promise<List | null> {
    let result: List | null = null;

    try {
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        return result;
      }
      const docRef = doc(this.firestoreDb, SHOPPING_LISTS, userId, USER_SHOPPING_LISTS, listId).withConverter(listConverter);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        result = docSnap.data() as List;
      }
    } catch (e) {
      console.error("Error: ", e);
    }

    return result;
  }

  public async getArticlesByListId(id: string): Promise<Article[]> {
    const result: Article[] = [];

    // const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);

    try {
      const querySnapshot = await getDocs(collection(this.firestoreDb, ARTICLES, id, SHOPPING_LIST_ARTICLES).withConverter(articleConverter));
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const rsData = doc.data() as Article;
        // const checkedTimestampField = rsData.checkedTimestamp;
        //
        // if (checkedTimestampField && checkedTimestampField instanceof Timestamp) {
        //   // const checkedTimestamp: Timestamp = checkedTimestampField;
        //   const jsTimestamp = new Date(checkedTimestampField.toMillis());
        //
        //   if (jsTimestamp < yesterday) {
        //     console.log('Der checkedTimestamp ist von gestern.');
        //     // result.push(rsData);
        //   }
        // }

        result.push(rsData);
      });
    } catch (e) {
      console.error("Error: ", e);
    }

    return result;
  }

  public async addArticle(listId: string, article: Article): Promise<string> {
    try {
      const newDocRef = await addDoc(
        collection(this.firestoreDb, ARTICLES, listId, SHOPPING_LIST_ARTICLES)
          .withConverter(articleConverter),
        article);
      // console.log('New document added with ID:', newDocRef.id);
      return newDocRef.id;
    } catch (e) {
      console.error("Error: ", e);
      return '';
    }
  }

  public updateArticle(listId: string, article: Article): void {
    try {
      const docRef = doc(this.firestoreDb, ARTICLES, listId, SHOPPING_LIST_ARTICLES, article.docId);

      const currentTime = serverTimestamp();

      updateDoc(docRef, {
        checked: article.checked,
        checkedTimestamp: currentTime
      });
    } catch (e) {
      console.error("Error: ", e);
    }
  }

  public deleteArticle(listId: string, article: Article): void {
    try {
      const docRef = doc(this.firestoreDb, ARTICLES, listId, SHOPPING_LIST_ARTICLES, article.docId);
      deleteDoc(docRef);
    } catch (e) {
      console.error("Error: ", e);
    }
  }

  public async getArticleSuggestions(): Promise<SuggestedArticle[]> {
    let result: SuggestedArticle[] = [];

    try {
      const docRef = doc(this.firestoreDb, SUGGESTED_ARTICLES, SUGGESTED_ARTICLES_DOC_ID).withConverter(suggestedArticlesConverter);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        result = docSnap.data() as SuggestedArticle[];
      }
    } catch (e) {
      console.error("Error: ", e);
    }

    return result;
  }

  public async getArticleCategories(): Promise<typeof ArticleCategoryArray[number][]> {
    let result: typeof ArticleCategoryArray[number][] = [];

    try {
      const docRef = doc(this.firestoreDb, ARTICLE_CATEGORIES, ARTICLE_CATEGORIES_DOC_ID).withConverter(articleCategoryConverter);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        result = docSnap.data() as typeof ArticleCategoryArray[number][];
      }
    } catch (e) {
      console.error("Error: ", e);
    }

    return result;
  }

  public async getStores(): Promise<Store[]> {
    let result: Store[] = [];

    try {
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        return result;
      }
      const docRef = doc(this.firestoreDb, STORES, userId).withConverter(storeConverter);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        result = this.sortItems(docSnap.data()) as Store[];
      } else {
        console.log("stores do NOT exists");
        result = this.sortItems(await this.createUserStores(userId)) as Store[];
      }
    } catch (e) {
      console.error("Error: ", e);
    }

    return result;
  }

  private async createUserStores(userId: string) {
    console.log("createUserStores");
    let result: Store[] = [];
    try {
      const docRef = doc(this.firestoreDb, STORES, STORES_DEFAULT_DOC_ID).withConverter(storeConverter);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("default exists - save now as user specific");
        const newDocRef = doc(this.firestoreDb, STORES, userId).withConverter(storeConverter);
        setDoc(newDocRef, docSnap.data());
        result = docSnap.data();
      }
    } catch (e) {
      console.error("Error: ", e);
    }

    return result;

  }

  public updateStore(stores: Store[]): void {
    try {
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        return;
      }
      const docRef = doc(this.firestoreDb, STORES, userId).withConverter(storeConverter);
      setDoc(docRef, stores);
    } catch (e) {
      console.error("Error: ", e);
    }
  }

  public async createUser(user: User): Promise<void> {
    try {
      await setDoc(doc(this.firestoreDb, USERS, user.uid), {
        name: user.displayName,
        email: user.email,
        avatar: 'default'
      });
    } catch (e) {
      console.error("Error: ", e);
    }
  }

  private async userExists(userId: string): Promise<boolean> {
    const docRef = doc(this.firestoreDb, USERS, userId);

    try {
      const docSnapshot = await getDoc(docRef);
      return docSnapshot.exists();
    } catch (e) {
      console.error("Error: ", e);
    }

    return false;
  }


  public async getUserAvatar(userId: string): Promise<string | null> {

    const docRef = doc(this.firestoreDb, USERS, userId);

    try {
      const docSnapshot = await getDoc(docRef);
      console.log(docSnapshot.data());
      return null;
    } catch (e) {
      console.error("Error: ", e);
    }

    return null;
  }

  private sortItems(items: Store[]): Store[] {
    const sortedItems = [...items];

    sortedItems.sort((a: Store, b: Store) => {
      if (b.isFavourite !== a.isFavourite) {
        return b.isFavourite ? 1 : -1;
      }

      if (a.category === b.category) {
        return a.name.localeCompare(b.name);
      }

      const categoryOrder: { [key: string]: number } = {
        Lebensmittel: 1,
        Drogerie: 2,
      };

      return (categoryOrder[a.category] || 0) - (categoryOrder[b.category] || 0);
    });

    return sortedItems;
  }
}
