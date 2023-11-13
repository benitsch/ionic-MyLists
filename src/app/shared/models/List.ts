import {Article, StoreArticles, User} from "@data/interfaces/interfaces";

class List {
  id: string;
  name: string;
  articles: Article[];
  users: User[];
  color: string = 'white';

  constructor(id: string, name: string, articles: Article[], users: User[]) {
    this.id = id;
    this.name = name;
    this.articles = articles;
    this.users = users;
  }


  getSortedArticles(): StoreArticles {
    return this.groupArticlesByStoreAndCategory();
  }

  groupArticlesByStoreAndCategory(): StoreArticles {
    const groupedArticles: StoreArticles = {};

    for (const article of this.articles) {
      const storeName = article.store.name;
      const category = article.category;

      if (!groupedArticles[storeName]) {
        groupedArticles[storeName] = {};
      }

      if (!groupedArticles[storeName][category]) {
        groupedArticles[storeName][category] = [];
      }

      groupedArticles[storeName][category].push(article);
    }

    return groupedArticles;
  }

  addArticle(article: Article): void {
    this.articles.push(article);
  }

  deleteArticle(article: Article): void {
    const index = this.articles.indexOf(article);
    if (index !== -1) {
      this.articles.splice(index, 1);
    }
  }

}

export default List;
