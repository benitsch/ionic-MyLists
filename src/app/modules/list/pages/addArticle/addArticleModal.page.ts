import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IonModal, ModalController} from '@ionic/angular';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Article, ArticleCategoryArray, StoreNamesArray, SuggestedArticle} from "@data/interfaces/interfaces";
import Store from "@shared/models/Store";
import {DataService} from "@data/services/api/data.service";

@Component({
  selector: 'app-add-article-modal',
  templateUrl: './addArticleModal.page.html',
  styleUrls: ['./addArticleModal.page.scss'],
})
export class AddArticleModalPage implements OnInit {
  @ViewChild('articleSuggestionModal', {static: true}) articleSuggestionModal!: IonModal;
  @Input() currentStore?: typeof StoreNamesArray[number]; // Users current selected store segment to set its name as default value in form.

  articleCategories: typeof ArticleCategoryArray[number][] = [];
  stores: Store[] = [];

  minValidUntil!: string;
  myForm!: FormGroup;

  constructor(
    private dataService: DataService,
    private modalController: ModalController,
    private formBuilder: FormBuilder
    ) {}

  ngOnInit() {
    this.setupForm();
    this.setupData();
  }

  setupForm(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    this.minValidUntil = tomorrow.toISOString();
    this.myForm = this.formBuilder.group({
      articleName: ['', [Validators.required]],
      inSale: false,
      buyWithDiscount: false,
      validFrom: today.toISOString(),
      validUntil: tomorrow.toISOString(),
      selectedCategory: '',
      amount: ['1', [Validators.required, Validators.min(1)]],
      selectedStore: '0',
    });
  }

  async setupData(): Promise<void> {
    this.articleCategories = await this.dataService.getArticleCategories();
    const otherIdx = this.articleCategories.indexOf('Sonstiges');
    this.selectedCategory = otherIdx !== -1 ? otherIdx.toString() : '0';

    this.stores = await this.dataService.getStores();
    const storeIdx = this.stores.findIndex((store: Store) => store.name === (this.currentStore || 'Spar'));
    this.selectedStore = storeIdx > -1 ? storeIdx.toString() : '0';
  }

  get articleName(): FormControl {
    return this.myForm.get('articleName') as FormControl;
  }

  set articleName(val: any) {
    this.myForm.get('articleName')!.setValue(val);
  }

  get inSale(): FormControl {
    return this.myForm.get('inSale') as FormControl;
  }

  get buyWithDiscount(): FormControl {
    return this.myForm.get('buyWithDiscount') as FormControl;
  }

  get validFrom(): FormControl {
    return this.myForm.get('validFrom') as FormControl;
  }

  get validUntil(): FormControl {
    return this.myForm.get('validUntil') as FormControl;
  }

  set validUntil(val: any) {
    this.myForm.get('validUntil')!.setValue(val);
  }

  get selectedCategory(): FormControl {
    return this.myForm.get('selectedCategory') as FormControl;
  }

  set selectedCategory(val: any) {
    this.myForm.get('selectedCategory')!.setValue(val);
  }

  get amount(): FormControl {
    return this.myForm.get('amount') as FormControl;
  }

  get selectedStore(): FormControl {
    return this.myForm.get('selectedStore') as FormControl;
  }

  set selectedStore(val: any) {
    this.myForm.get('selectedStore')!.setValue(val);
  }

  async articleAddClick(articleName: string): Promise<void> {
    this.articleName = articleName;
    await this.articleSuggestionModal.dismiss();
  }

  /**
   * Handles the click event of the typeahead component when a suggested article was clicked.
   * Sets the article name, category, and selected store based on the provided suggested article if available.
   * Dismisses the article suggestion modal afterward.
   *
   * @param {SuggestedArticle} suggestedArticle
   * @returns {Promise<void>}
   */
  async articleSuggestionClick(suggestedArticle: SuggestedArticle): Promise<void> {
    this.articleName = suggestedArticle.name;
    if (suggestedArticle.category) {

      const categoryNameIdx = this.articleCategories.findIndex((articleCategory: typeof ArticleCategoryArray[number]) => articleCategory === suggestedArticle.category);
      const otherIdx = this.articleCategories.indexOf('Sonstiges');
      this.selectedCategory = categoryNameIdx > -1 ? categoryNameIdx.toString() : otherIdx > -1 ? otherIdx.toString() : '0';
    }
    if (suggestedArticle.store) {
      const storeNameIdx = this.stores.findIndex((store: Store) => store.name === suggestedArticle.store);
      this.selectedStore = storeNameIdx > -1 ? storeNameIdx.toString() : "0";
    }
    await this.articleSuggestionModal.dismiss();
  }

  updateMinValidUntil(): void {
    if (this.validFrom) {
      const minDate = new Date(this.validFrom.value);
      minDate.setDate(minDate.getDate() + 1);
      this.minValidUntil = minDate.toISOString();
    }
  }

  validFromChanged(): void {
    if (this.validFrom?.value && this.validUntil?.value && this.validUntil.value < this.validFrom.value) {
      let plusOneDay = new Date(this.validFrom.value);
      plusOneDay.setDate(plusOneDay.getDate() + 1)
      this.validUntil = plusOneDay.toISOString();
    }

    this.updateMinValidUntil();
  }

  async saveArticle(): Promise<void> {
    Object.keys(this.myForm.controls).forEach((controlName: string) => {
      const control: AbstractControl | null = this.myForm.get(controlName);

      if (control) {
        control.markAsTouched();
        // control.updateValueAndValidity();
      }
    });
    if (this.myForm.valid) {
      const newArticle: Article = {
        name: this.articleName.value,
        checked: false,
        inSale: this.inSale.value,
        buyWithDiscount: this.buyWithDiscount.value,
        validFrom: this.inSale.value ? this.validFrom?.value : null,
        validUntil: this.inSale.value ? this.validUntil?.value : null,
        category: this.articleCategories[this.selectedCategory.value],
        amount: +this.amount.value,
        store: new Store(this.stores[this.selectedStore.value].name),
        docId: '',
      };
      await this.modalController.dismiss(newArticle);
    }
  }

  async close(): Promise<void> {
    await this.modalController.dismiss();
  }
}
