import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IonInput, ModalController} from '@ionic/angular';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import List from "@shared/models/List";
import {AuthService} from "@data/services/authentication/auth.service";

@Component({
  selector: 'app-add-list-modal',
  templateUrl: './addListModal.page.html',
  styleUrls: ['./addListModal.page.scss'],
})
export class AddListModalPage implements OnInit {
  @ViewChild('listNameInput') listNameInput!: IonInput;
  @Input() listToEdit: List | null = null;

  myForm!: FormGroup;
  isEditing: boolean = false;
  circleColors: string[] = ['yellow', 'orange', 'red', 'pink', 'purple', 'blue', 'blue-light', 'turquoise', 'green-light', 'green'];
  selectedColor: string = 'white';

  private prefersDark = false;

  constructor(
    private authService: AuthService,
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (this.prefersDark) {
      this.circleColors.unshift('black');
    } else {
      this.circleColors.unshift('white');
    }
  }

  ngOnInit() {
    this.setupData();
    this.setupForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.listNameInput.setFocus();
    }, 200);
  }

  setupData(): void {
    this.isEditing = !!this.listToEdit;

    if (this.isEditing && this.listToEdit) {
      this.selectedColor = this.listToEdit.color;
    }
  }

  setupForm(): void {
    this.myForm = this.formBuilder.group({
      listName: ['', [Validators.required]],
    });

    if (this.isEditing && this.listToEdit) {
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
      let list: List;

      if (this.isEditing && this.listToEdit) {
        // Update List
        this.listToEdit.name = this.listName.value;
        this.listToEdit.color = this.selectedColor;
        list = this.listToEdit;
      } else {
        // Create new List
        list = new List(
          this.listName.value,
          [],
          this.selectedColor,
        );
        const userId = this.authService.getCurrentUserId();
        if (userId) {
          list.createdBy = userId;
        }
      }

      await this.modalController.dismiss(list);
    }
  }

  async close(): Promise<void> {
    await this.modalController.dismiss();
  }
}
