import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from "@data/services/api/data.service";
import {Article, StoreArticles, StoreNamesArray} from "@data/interfaces/interfaces";
import List from "@shared/models/List";
import {ModalController} from "@ionic/angular";
import {AddArticleModalPage} from "@modules/list/pages/addArticle/addArticleModal.page";
import {Timestamp} from "@angular/fire/firestore";

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  listId!: string;
  public list!: List;
  public storeItems!: StoreArticles;
  public selectedStore!: string;

  isLoading: boolean = false;

  constructor(
    public modalController: ModalController,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute
    ) {
    this.listId = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  ngOnInit() {
    this.setupList();
  }

  async setupList(): Promise<void> {
    this.isLoading = true;
    this.dataService.getListById(this.listId).then((value: List | null) => {
      if (value) {
        this.list = value;
        this.dataService.getArticlesByListId(this.listId).then((value: Article[]) => {
          this.list.articles = this.filterOldCheckedArticles(value);
          this.setupSegments();
          this.isLoading = false;
        });
      }
    });
  }

  /**
   * Deletes all articles in BE which were checked in the past.
   * Returns a list of articles where "checked" is not older than yesterday.
   *
   * @param {Article[]} articles
   */
  filterOldCheckedArticles(articles: Article[]): Article[] {
    const filteredArticles: Article[] = [];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    articles.forEach((article: Article) => {
      if (article.checkedTimestamp && article.checkedTimestamp instanceof Timestamp) {

        const jsTimestamp = new Date(article.checkedTimestamp.toMillis());
        if (article.checked && jsTimestamp < yesterday) {
          this.dataService.deleteArticle(this.listId, article);
        } else {
          filteredArticles.push(article);
        }
      } else {
        filteredArticles.push(article);
      }
    });

    return filteredArticles;
  }

  setupSegments(): void {
    this.storeItems = this.list.getSortedArticles();
    console.log(this.storeItems);
    // FIXME when i delete articles, the first elm for selectedStore is sometimes different (alphabetically?).
    // When I delete the last article of a store, select/show another store, instead of showing no store.
    this.selectedStore = Object.keys(this.storeItems)[0];
  }

  showLabel(): boolean {
    return Object.keys(this.storeItems).length < 3;
  }

  async openAddArticleModal() {
    const modal = await this.modalController.create({
      component: AddArticleModalPage,
      componentProps: {
        currentStore: this.selectedStore
      },
    });
    await modal.present();

    const rs = await modal.onWillDismiss();
    if (rs.data as Article) { // Modal is closed with save btn, not with cancel btn
      this.list.addArticle(rs.data);
      // this.storeItems = this.list.getSortedArticles();
      this.setupSegments();
      this.dataService.addArticle(this.listId, rs.data).then((value) => {
        rs.data.docId = value;
      });
    }
  }

  deleteArticle(article: Article): void {
    // FIXME After deleting an article, the automatically horizontal scroll for longer article names do not work anymore
    this.list.deleteArticle(article);
    this.storeItems = this.list.getSortedArticles();
    this.dataService.deleteArticle(this.listId, article);
  }

  /**
   * TODO use constants instead of strings.
   * 
   * @param storeName 
   * @returns
   */
  getSvgPathForStore(storeName: typeof StoreNamesArray[number]): string {
    switch (storeName) {
      case 'Adeg':
        return 'assets/images/stores/adeg.svg';
      case 'Billa':
        return 'assets/images/stores/billa.svg';
      case 'Billa+':
        return 'assets/images/stores/billaplus.svg';
      case 'Bipa':
        return 'assets/images/stores/bipa.svg';
      case 'Dm':
        return 'assets/images/stores/dm.svg';
      case 'Hofer':
        return 'assets/images/stores/hofer.svg';
      case 'MediaMarkt':
        return 'assets/images/stores/mediamarkt.svg';
      case 'MPreis':
        return 'assets/images/stores/mpreis.svg';
      case 'Müller':
        return 'assets/images/stores/mueller.svg';
      case 'Norma':
        return 'assets/images/stores/norma.svg';
      case 'Penny':
        return 'assets/images/stores/penny.svg';
      case 'Spar':
        return 'assets/images/stores/spar.svg';
      case 'Unimarkt':
        return 'assets/images/stores/unimarkt.svg';
      case 'Lidl':
        return 'assets/images/stores/lidl.svg';
      default:
        return 'assets/images/stores/default.svg';
    }
  }

  async handleRefresh(event: any): Promise<void> {
    await this.setupList();
    event.target.complete();
  }
}
