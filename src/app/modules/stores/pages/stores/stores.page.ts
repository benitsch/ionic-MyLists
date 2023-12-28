import {Component, inject, OnInit} from '@angular/core';
import Store from "@shared/models/Store";
import {DataService} from "@data/services/api/data.service";

@Component({
  selector: 'app-stores',
  templateUrl: './stores.page.html',
  styleUrls: ['./stores.page.scss'],
})
export class StoresPage implements OnInit {
  stores: Store[] = [];

  isLoading: boolean = false;

  private dataService = inject(DataService);

  constructor() {
  }

  ngOnInit() {
    this.loadStores()
  }

  async loadStores(): Promise<void> {
    this.isLoading = true;
    this.stores = await this.dataService.getStores();
    this.isLoading = false;
  }

  toggleFavorite(store: Store): void {
    store.isFavourite = !store.isFavourite;
    this.dataService.updateStore(this.stores);
  }

  isFavorite(store: Store): boolean {
    return store.isFavourite;
  }

  async handleRefresh(event: any): Promise<void> {
    await this.loadStores();
    event.target.complete();
  }
}
