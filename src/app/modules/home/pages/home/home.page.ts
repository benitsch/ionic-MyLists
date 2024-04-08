import {Component, OnInit, Optional, ViewChild} from '@angular/core';
import {DataService} from "@data/services/api/data.service";
import List from "@shared/models/List";
import {AlertController, IonList, IonRouterOutlet, ItemReorderEventDetail, ModalController, Platform} from "@ionic/angular";
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
  @ViewChild('list') list!: IonList;
  
  lists: List[] = [];
  isLoading: boolean = false;
  isEditDisabled: boolean = true;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
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

  /**
   * Get all lists and their article amount from BE.
   */
  async setupLists(): Promise<void> {
    this.isLoading = true;
    try {
      this.lists = await this.dataService.getLists();
    } catch (e) {
      console.error("Error: ", e);
    }

    for (let i = 0, len = this.lists.length; i < len; i++) {
      const list = this.lists[i];
      // FIXME When I add a new article and go back to the list overview, the amount of articles are not up-to-date
      list.articlesCount = await this.dataService.getArticleAmountByListId(list.docId);
      // list.amountOfUsers = await this.dataService.getUsersAmountByListId(list.docId);
      // console.log(list.amountOfUsers);
      // this.test = Array(list.amountOfUsers).fill(0);
      // console.log(this.test);
    }

    this.isLoading = false;
  }

  deleteList(list: List): void {
    const index = this.lists.indexOf(list);
    if (index !== -1) {
      this.lists.splice(index, 1);
    }
    this.dataService.deleteList(list);
  }

  toggleEdit(): void {
    this.isEditDisabled = !this.isEditDisabled;
    if (this.isEditDisabled) {
      this.list.closeSlidingItems();
    }
  }

  /**
   * Opens the modal for editing an existing list or add a new list.
   * 
   * @param { List | null} listToEdit List object when you want to edit a list, otherwise null for adding a new list
   */
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
      if (listToEdit) { // Update existing list
        this.dataService.updateList(rs.data as List);
      } else { // Add new list
        this.lists.push(rs.data as List);
        this.dataService.addList(rs.data).then((value) => rs.data.docId = value);
      }
    }

    if (!this.isEditDisabled) {
      this.toggleEdit();
    }
  }

  /**
   * Opens the camera to scan a QR code from another person to add that person to the given list.
   * If the scanning process or adding the user to the list fails, an alert message is shown.
   * 
   * @param {List} list 
   */
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
    // FIXME "Unhandled Promise rejection" error, because its async await (without no errors in console)
    await this.setupLists();
    // await this.setupLists().catch(e => console.log(e));
    event.target.complete();
  }

  /**
   * Will install the Google Barcode Scanner module, if not available.
   * At the moment only Android is supported (no iOS).
   */
  async setupBarcodeScanner(): Promise<void> {
    try {
      const {available} = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();

      if (!available) {
        await BarcodeScanner.installGoogleBarcodeScannerModule();
      }
    } catch (e) {
      console.log("Error:", e);
    }
  }

  /**
   * Returns the scanned barcode value if camera access is granted, otherwise an alert message is shown.
   */
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

  /**
   * Checks the permissions to allow camera access.
   * 
   * @returns True if the camera access is granted or limited, otherwise false
   */
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

  
  /**
   * TODO implementation
   * 
   * @param ev 
   */
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

    const moveFromPosition = ev.detail.from;
    const moveToPosition = ev.detail.to;

    // swap items in array
    this.lists.splice(moveToPosition, 0, this.lists.splice(moveFromPosition, 1)[0]);

    ev.detail.complete();
  }
}
