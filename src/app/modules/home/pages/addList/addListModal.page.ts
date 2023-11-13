import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Article, User} from "@data/interfaces/interfaces";

import List from "@shared/models/List";

@Component({
  selector: 'app-add-list-modal',
  templateUrl: './addListModal.page.html',
  styleUrls: ['./addListModal.page.scss'],
})
export class AddListModalPage implements OnInit {
  @Input() listToEdit: List | null = null;
  private id: string;
  private articles: Article[] = [];
  private users: User[] = []
  myForm!: FormGroup;
  isEditing: boolean = false;
  circleColors: string[] = ['white', 'yellow', 'orange', 'red', 'pink', 'purple', 'blue', 'blue-light', 'turquoise', 'green-light', 'green'];
  selectedColor: string = 'white';

  constructor(private modalController: ModalController, private formBuilder: FormBuilder) {
    // TODO change to dynamically id (by firebase?)
    this.id = "new-test-list-123";
  }

  ngOnInit() {
    this.isEditing = !!this.listToEdit;

    this.myForm = this.formBuilder.group({
      listName: ['', [Validators.required]],
    });

    if (this.isEditing && this.listToEdit) {
      this.selectedColor = this.listToEdit.color;
      this.myForm.patchValue({
        listName: this.listToEdit.name,
      });
    }
  }

  get listName(): FormControl {
    return this.myForm.get('listName') as FormControl;
  }

  set listName(val: any) {
    this.myForm.get('listName')!.setValue(val);
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  async saveList(): Promise<void> {
    Object.keys(this.myForm.controls).forEach((controlName: string) => {
      const control: AbstractControl | null = this.myForm.get(controlName);

      if (control) {
        control.markAsTouched();
        // control.updateValueAndValidity();
      }
    });
    if (this.myForm.valid) {
      const newList = new List(
        this.id,
        this.listName.value,
        this.articles,
        this.users,
        );
      newList.color = this.selectedColor;
      await this.modalController.dismiss(newList);
    }
  }

  async close(): Promise<void> {
    await this.modalController.dismiss();
  }
}
