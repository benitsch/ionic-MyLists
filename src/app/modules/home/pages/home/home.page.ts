import {Component, inject, OnInit} from '@angular/core';
import {DataService} from "@data/services/api/data.service";
import List from "@shared/models/List";
import {ItemReorderEventDetail, ModalController} from "@ionic/angular";
import {AddListModalPage} from "@modules/home/pages/addList/addListModal.page";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public lists!: List[];

  private dataService = inject(DataService);
  isReorderDisabled: boolean = true;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.lists = this.dataService.getLists();
  }

  getLists(): List[] {
    return this.lists;
  }

  deleteList(list: List): void {
    const index = this.lists.indexOf(list);
    if (index !== -1) {
      this.lists.splice(index, 1);
    }
  }

  toggleEdit(): void {
    this.isReorderDisabled = !this.isReorderDisabled;
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // console.log(ev);
    // // The `from` and `to` properties contain the index of the item
    // // when the drag started and ended, respectively
    // console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    //
    // // Finish the reorder and position the item in the DOM based on
    // // where the gesture ended. This method can also be called directly
    // // by the reorder group
    // ev.detail.complete();

    const moveFromPosition = ev.detail.from;
    const moveToPosition = ev.detail.to;

    // Ihre spezifische Logik zur Aktualisierung der Reihenfolge hier einfügen

    // Beispiel: Tauschen Sie die Elemente in einem Array
    this.lists.splice(moveToPosition, 0, this.lists.splice(moveFromPosition, 1)[0]);

    // Hier können Sie auch Ihre spezifische Logik für die Datenbank oder Service-Aktualisierung einfügen

    ev.detail.complete();
  }
  trackItems(index: any, itemNumber: any) {
    return itemNumber;
  }

  async openAddListModal(listToEdit: List | null = null) {
    const modal = await this.modalController.create({
      component: AddListModalPage,
      componentProps: {
        listToEdit: listToEdit,
      },
    });
    await modal.present();

    const rs = await modal.onWillDismiss();
    if (rs.data) {
      if (listToEdit) {
        // Update existing list
        const index = this.lists.findIndex(list => list.id === listToEdit.id);
        if (index !== -1) {
          this.lists[index] = rs.data as List;
        }
      } else {
        // Add new list
        this.lists.push(rs.data as List);
      }
    }
    // FIXME Whether we want to toggle the edit mode after we edited/add a list?
    // if (!this.isReorderDisabled) {
    //   this.toggleEdit();
    // }
  }

  openCamera(): void {
    console.log("Open Camera to scan QR Code");
  }
}
