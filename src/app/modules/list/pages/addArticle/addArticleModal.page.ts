import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IonModal, ModalController} from '@ionic/angular';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Article, ArticleCategory, StoreName} from "@data/interfaces/interfaces";
import Store from "@shared/models/Store";
import {getEnumKeyByValue, getEnumValueByKey} from "@shared/common-functions/common";

@Component({
  selector: 'app-add-article-modal',
  templateUrl: './addArticleModal.page.html',
  styleUrls: ['./addArticleModal.page.scss'],
})
export class AddArticleModalPage implements OnInit {
  @ViewChild('articleSuggestionModal', {static: true}) articleSuggestionModal!: IonModal;

  @Input() currentStore?: StoreName // Users current selected store segment to set its name as default value in form.

  minValidUntil!: string;
  myForm!: FormGroup;

  constructor(private modalController: ModalController, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
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
      category: getEnumKeyByValue(ArticleCategory, ArticleCategory.Other),
      amount: ['1', [Validators.required, Validators.min(1)]],
      selectedStore: this.currentStore ? getEnumKeyByValue(StoreName, this.currentStore) : StoreName.Spar,
    });
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


  get category(): FormControl {
    return this.myForm.get('category') as FormControl;
  }

  get amount(): FormControl {
    return this.myForm.get('amount') as FormControl;
  }

  get selectedStore(): FormControl {
    return this.myForm.get('selectedStore') as FormControl;
  }

  async articleSuggestionClick(articleSuggestion: string) {
    this.articleName = articleSuggestion;
    await this.articleSuggestionModal.dismiss();
  }

  getArticleCategories() {
    return Object.entries(ArticleCategory).map(([key, value]) => ({key, value}));
  }

  getStores() {
    return Object.entries(StoreName).map(([key, value]) => ({key, value}));
  }

  updateMinValidUntil(): void {
    if (this.validFrom) {
      const minDate = new Date(this.validFrom.value);
      minDate.setDate(minDate.getDate() + 1); // Add one day
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
        category: getEnumValueByKey(ArticleCategory, this.category.value) as ArticleCategory,
        amount: +this.amount.value,
        store: new Store(getEnumValueByKey(StoreName, this.selectedStore.value) as StoreName),
      };
      await this.modalController.dismiss(newArticle);
    }
  }

  async close(): Promise<void> {
    await this.modalController.dismiss();
  }
}
