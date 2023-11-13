import {Component, OnInit} from '@angular/core';
import Store from "@shared/models/Store";
import {StoreCategory, StoreName} from "@data/interfaces/interfaces";

@Component({
  selector: 'app-stores',
  templateUrl: './stores.page.html',
  styleUrls: ['./stores.page.scss'],
})
export class StoresPage implements OnInit {
  stores: Store[] = [];

  constructor() { }

  ngOnInit() {
    Object.values(StoreName).forEach((storeName: StoreName) => {
      const store = new Store(storeName);
      this.stores.push(store);
    });
  }

  toggleFavorite(store: Store): void {
    store.isFavourite = !store.isFavourite;
  }

  isFavorite(store: Store): boolean {
    return store.isFavourite;
  }

}
