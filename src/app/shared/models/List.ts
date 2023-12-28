import {Article, StoreArticles} from "@data/interfaces/interfaces";

class List {
  name: string;
  articles: Article[];
  color: string;
  docId: string = '';
  articlesCount: number = 0;
  createdBy: string = '';
  amountOfUsers: number = 0;

  constructor(name: string, articles: Article[] = [], color: string = 'white') {
    this.name = name;
    this.articles = articles;
    this.color = color;
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
