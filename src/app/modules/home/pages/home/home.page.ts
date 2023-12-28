import {Component, inject, OnInit, Optional} from '@angular/core';
import {DataService} from "@data/services/api/data.service";
import List from "@shared/models/List";
import {AlertController, IonRouterOutlet, ItemReorderEventDetail, ModalController, Platform} from "@ionic/angular";
import {AddListModalPage} from "@modules/home/pages/addList/addListModal.page";
import {AuthService} from "@data/services/authentication/auth.service";
import {BarcodeFormat, BarcodeScanner} from "@capacitor-mlkit/barcode-scanning";
import {App} from "@capacitor/app";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  lists: List[] = [];
  isLoading: boolean = false;
  // TODO change var name to isEditEnabled oder so, da es nicht nur um reordering geht
  isReorderDisabled: boolean = true;

  private dataService = inject(DataService);

  constructor(
    private authService: AuthService,
    private modalController: ModalController,
    private alertController: AlertController,
    private platform: Platform,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet?.canGoBack()) {
        App.exitApp();
      }
    });
  }

  ngOnInit() {
    this.setupBarcodeScanner();
    this.setupLists();
  }

  async setupLists(): Promise<void> {
    this.isLoading = true;
    try {
      this.lists = await this.dataService.getLists();
    } catch (e) {
      console.error("Error: ", e);
    }

    for (let i = 0; i < this.lists.length; i++) {
      const list = this.lists[i];
      // FIXME wenn ich ein artikel zu einer liste hinzufüge und dann zurück zur listenübersicht gehe stimmt der amount of articles nicht mehr.
      list.articlesCount = await this.dataService.getArticleAmountByListId(list.docId);
      // list.amountOfUsers = await this.dataService.getUsersAmountByListId(list.docId);
      // TODO hier weiter machen, checken wie ich das machen kann die func getUsersAmountByListId
      // console.log(list.amountOfUsers);
      // this.test = Array(list.amountOfUsers).fill(0);
      // console.log(this.test);
    }

    this.isLoading = false;
  }

  deleteList(list: List): void {
    // TODO villt. den side scroll für delete nur im edit mode enablen/anzeigen?
    const index = this.lists.indexOf(list);
    if (index !== -1) {
      this.lists.splice(index, 1);
    }
    this.dataService.deleteList(list);
  }

  toggleEdit(): void {
    this.isReorderDisabled = !this.isReorderDisabled;
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>): void {
    // console.log(ev);
    // // The `from` and `to` properties contain the index of the item
    // // when the drag started and ended, respectively
    // console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    //
    // // Finish the reorder and position the item in the DOM based on
    // // where the gesture ended. This method can also be called directly
    // // by the reorder group
    // ev.detail.complete();
    // TODO implement reorder
    const moveFromPosition = ev.detail.from;
    const moveToPosition = ev.detail.to;

    // Ihre spezifische Logik zur Aktualisierung der Reihenfolge hier einfügen

    // Beispiel: Tauschen Sie die Elemente in einem Array
    this.lists.splice(moveToPosition, 0, this.lists.splice(moveFromPosition, 1)[0]);

    // Hier können Sie auch Ihre spezifische Logik für die Datenbank oder Service-Aktualisierung einfügen

    ev.detail.complete();
  }

  async openAddListModal(listToEdit: List | null = null): Promise<void> {
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
        this.dataService.updateList(rs.data as List);
      } else {
        // Add new list
        this.lists.push(rs.data as List);
        this.dataService.addList(rs.data).then((value) => rs.data.docId = value);
      }
    }

    if (!this.isReorderDisabled) {
      this.toggleEdit();
    }
  }

  async openCamera(list: List): Promise<void> {
    const scannedData = await this.scan();
    if (!scannedData) {
      await this.presentAlert('Fehlgeschlagen', 'Das scannen hat nicht geklappt.');
      return;
    }

    const success = await this.dataService.addUserToList(list, scannedData);
    if (!success) {
      await this.presentAlert('Fehlgeschlagen', 'Es hat nicht geklappt den Benutzer hinzuzufügen.');
    }
  }

  async handleRefresh(event: any): Promise<void> {
    // FIXME "Unhandled Promise rejection" error, da es async await ist, sonst kein error in der console.
    await this.setupLists();
    // await this.setupLists().catch(e => console.log(e));
    event.target.complete();
  }

  async setupBarcodeScanner(): Promise<void> {
    try {
      const {available} =
        await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();

      if (!available) {
        console.log("installGoogleBarcodeScannerModule");
        await BarcodeScanner.installGoogleBarcodeScannerModule();
      } else {
        console.log("not installGoogleBarcodeScannerModule");
      }
    } catch (e) {
      console.log("Error:", e);
    }
  }

  async scan(): Promise<string | void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      await this.presentAlert('Zugriff verweigert', 'Bitte erlauben Sie der App Zugriff auf die Kamera, um den Barcode-Scanner zu benutzen.');
      return;
    }

    const {barcodes} = await BarcodeScanner.scan({
      formats: [BarcodeFormat.QrCode],
    });

    return barcodes.length > 0 ? barcodes[0].displayValue : '';
  }

  async requestPermissions(): Promise<boolean> {
    const {camera} = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  userIsListOwner(list: List): boolean {
    return this.authService.getCurrentUserId() === list.createdBy;
  }
}
