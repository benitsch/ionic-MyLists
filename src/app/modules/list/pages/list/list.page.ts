import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from "@data/services/api/data.service";
import {Article, StoreArticles, StoreName} from "@data/interfaces/interfaces";
import List from "@shared/models/List";
import {ModalController} from "@ionic/angular";
import {AddArticleModalPage} from "@modules/list/pages/addArticle/addArticleModal.page";

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  private listId!: string;
  public list!: List;
  public storeItems!: StoreArticles;
  public selectedStore!: string;

  private dataService = inject(DataService);
  private activatedRoute = inject(ActivatedRoute);

  constructor(public modalController: ModalController) {
  }

  ngOnInit() {
    this.setupList();
    this.setupSegments();
  }

  setupList(): void {
    this.listId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.list = this.dataService.getListById(0);
    // TODO get list by item id
  }

  setupSegments(): void {
    this.storeItems = this.list.getSortedArticles();
    // FIXME when i delete articles, the first elm for selectedStore is sometimes different (alphabetically?).
    // Ebenso wenn ich artikel von stores lösche, dann soll er den letzten verbleibenden store (segment) auswählen (this.selectedStore setzten).
    this.selectedStore = Object.keys(this.storeItems)[0];
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
    if (rs.data) { // Modal is closed with save btn, not with cancel btn
      this.list.addArticle(rs.data as Article);
      this.storeItems = this.list.getSortedArticles();
    }
  }

  deleteArticle(article: Article): void {
    // FIXME nach dem löschen eines artikels, geht das scroll text bei langem artikel namen nicht mehr
    // Auch wenn ich die Stores/Segments wechsel
    this.list.deleteArticle(article);
    this.storeItems = this.list.getSortedArticles();
  }

  getSvgPathForStore(storeName: string): string {
    switch (storeName) {
      case StoreName.Adeg:
        return 'assets/images/stores/adeg.svg';
      case StoreName.Billa:
        return 'assets/images/stores/billa.svg';
      case StoreName.BillaPlus:
        return 'assets/images/stores/billaplus.svg';
      case StoreName.Bipa:
        return 'assets/images/stores/bipa.svg';
      case StoreName.Dm:
        return 'assets/images/stores/dm.svg';
      case StoreName.Hofer:
        return 'assets/images/stores/hofer.svg';
      case StoreName.MediaMarkt:
        return 'assets/images/stores/mediamarkt.svg';
      case StoreName.MPreis:
        return 'assets/images/stores/mpreis.svg';
      case StoreName.Mueller:
        return 'assets/images/stores/mueller.svg';
      case StoreName.Norma:
        return 'assets/images/stores/norma.svg';
      case StoreName.Penny:
        return 'assets/images/stores/penny.svg';
      case StoreName.Spar:
        return 'assets/images/stores/spar.svg';
      case StoreName.Unimarkt:
        return 'assets/images/stores/unimarkt.svg';
      default:
        return 'assets/images/stores/default.svg';
    }
  }
}
