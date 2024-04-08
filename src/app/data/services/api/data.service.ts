import {Injectable} from '@angular/core';
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
  updateDoc,
  getCountFromServer,
  writeBatch,
  arrayUnion,
} from "@angular/fire/firestore";
import {User} from "@angular/fire/auth";
import {
  ARTICLE_CATEGORIES,
  ARTICLE_CATEGORIES_DOC_ID,
  ARTICLES, SHARED_SHOPPING_LISTS,
  SHOPPING_LIST_ARTICLES,
  SHOPPING_LISTS,
  STORES,
  STORES_DEFAULT_DOC_ID,
  SUGGESTED_ARTICLES,
  SUGGESTED_ARTICLES_DOC_ID,
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


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private authService: AuthService,
    private firestoreDb: Firestore) {
  }

  /**
   * Returns all lists of the user currently logged in.
   */
  public async getLists(): Promise<List[]> {
    const result: List[] = [];
    try {
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        return result;
      }
      const querySnapshot = await getDocs(collection(this.firestoreDb, SHOPPING_LISTS, userId, USER_SHOPPING_LISTS).withConverter(listConverter));
      querySnapshot.forEach((doc) => {
        const rsData = doc.data();
        result.push(rsData as List);
      });
    } catch (e) {
      console.error("Error: ", e);
    }

    return result;
  }

  /**
   * Returns the amount of all articles by the given list.
   * 
   * @param {string} listId 
   */
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

  /**
   * Add the given list to the currently logged in user.
   * 
   * @param {List} list 
   * @returns The new document ID
   */
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

  /**
   * Checks whether the specified user exists, if so, it is added to the given list.
   * 
   * @param {List} list 
   * @param {string} userIdToAdd The user id
   * @returns Returns true if it was successful to add the given user to the given list, otherwise false
   */
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

  /**
   * If the currently logged in user is the owner of the given list, the new user is added to the given list.
   * 
   * @param {List} list 
   * @param {string} userIdToAdd 
   */
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

  /**
   * @param {List} list 
   */
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

  /**
   * Deletes the given list and if the current logged in user is the owner of the given list it will delete all its articles as well.
   * 
   * @param list 
   */
  public deleteList(list: List): void {
    try {
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        return;
      }

      const docRef = doc(this.firestoreDb, SHOPPING_LISTS, userId, USER_SHOPPING_LISTS, list.docId);
      if (list.createdBy === userId) {
        this.deleteAllArticles(list.docId);
        // TODO if it is a shared list and I'm the owner, delete from SHARED_SHOPPING_LISTS and delete list from all users within.
        // await updateDoc(docRef, {
        //   users: arrayRemove(userIdToAdd)
        // });
      }
      deleteDoc(docRef);
    } catch (e) {
      console.error("Error: ", e);
    }
  }

  /**
   * @param {string} listId 
   */
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

  /**
   * Returns the List by its given Id. If the user is not logged in or the list does not exists, null is returned.
   * 
   * @param {string} listId 
   * @returns {List | null} <List> if the listId exists, otherwise <null>.
   */
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

  /**
   * @param {string} id 
   */
  public async getArticlesByListId(id: string): Promise<Article[]> {
    const result: Article[] = [];
    try {
      const querySnapshot = await getDocs(collection(this.firestoreDb, ARTICLES, id, SHOPPING_LIST_ARTICLES).withConverter(articleConverter));
      querySnapshot.forEach((doc) => {
        const rsData = doc.data() as Article;
        result.push(rsData);
      });
    } catch (e) {
      console.error("Error: ", e);
    }

    return result;
  }

  /**
   * Adds the given article to the given list.
   * 
   * @param {string} listId 
   * @param {Article} article 
   * @returns The new document ID
   */
  public async addArticle(listId: string, article: Article): Promise<string> {
    try {
      const newDocRef = await addDoc(
        collection(this.firestoreDb, ARTICLES, listId, SHOPPING_LIST_ARTICLES)
          .withConverter(articleConverter),
        article);

      return newDocRef.id;
    } catch (e) {
      console.error("Error: ", e);
      return '';
    }
  }

  /**
   * Update the given article in the given list.
   * 
   * @param {string} listId 
   * @param {Article} article 
   */
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

  /**
   * @param {string} listId 
   * @param {Article} article 
   */
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

  /**
   * Returns user specific stores (with its favourites), otherwise it will creates and returns the stores.
   * 
   * @returns An array of Store objects
   */
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
        result = this.sortItems(await this.createUserStores(userId)) as Store[];
      }
    } catch (e) {
      console.error("Error: ", e);
    }

    return result;
  }

  /**
   * Copies the default stores to the given user.
   * 
   * @param {string} userId 
   * @returns An array of Store objects
   */
  private async createUserStores(userId: string): Promise<Store[]> {
    let result: Store[] = [];
    try {
      const docRef = doc(this.firestoreDb, STORES, STORES_DEFAULT_DOC_ID).withConverter(storeConverter);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const newDocRef = doc(this.firestoreDb, STORES, userId).withConverter(storeConverter);

        setDoc(newDocRef, docSnap.data());
        result = docSnap.data();
      }
    } catch (e) {
      console.error("Error: ", e);
    }

    return result;
  }

  /**
   * @param {Store} stores 
   * @returns void
   */
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

  /**
   * @param {User} user 
   */
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

  /**
   * @param {string} userId 
   * @returns Returns true if the given user exists, otherwise false
   */
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

  /**
   * TODO implementation
   * @param {string} userId 
   * @returns 
   */
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

  /**
   * Sorts the given array by its properties (first by isFavourite, then by category).
   * 
   * @param {Store[]} items 
   * @returns The sorted Store[]
   */
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
