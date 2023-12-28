import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {AuthService} from "@data/services/authentication/auth.service";
import {Router} from "@angular/router";
import {AlertController, LoadingController, MenuController} from "@ionic/angular";
import {UserCredential} from "@angular/fire/auth";
import {DataService} from "@data/services/api/data.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  myForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private menuCtrl: MenuController,
  ) {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.setupForm();
  }

  setupForm(): void {
    this.myForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [this.matchPassword()]
      });
  }

  get name(): FormControl {
    return this.myForm.get('name') as FormControl;
  }

  get email(): FormControl {
    return this.myForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.myForm.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.myForm.get('confirmPassword') as FormControl;
  }

  matchPassword(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get('password');
      const confirmPasswordControl = formGroup.get('confirmPassword');

      if (passwordControl && confirmPasswordControl && passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({passwordNotMatch: true});
        return {passwordNotMatch: true};
      } else {
        confirmPasswordControl?.setErrors(null);
        return null;
      }
    };
  }

  getPasswordErrorText(): string {
    const control = this.password;

    if (control.hasError('required')) {
      return 'Ein Passwort ist erforderlich.';
    }

    if (control.hasError('minlength')) {
      return 'Ein Passwort muss min. 6 Zeichen lang sein.';
    }

    return '';
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();
    const userCredential: UserCredential | null = await this.authService.register(this.name.value, this.email.value, this.password.value);
    if (userCredential) {
      await this.dataService.createUser(userCredential.user);
    }
    await loading.dismiss();

    if (userCredential) {
      await this.showAlert('Registrierung erfolgreich', 'Bitte überprüfe dein E-Mail-Postfach, um die Registrierung abzuschließen.', true);
    } else {
      await this.showAlert('Registrierung fehlgeschlagen', 'Bitte versuche es erneut!');
    }
  }

  async showAlert(header: string, message: string, navigateToLogin: boolean = false) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'OK',
        handler: () => {
          if (navigateToLogin) {
            this.router.navigateByUrl('/login', { replaceUrl: true });
          }
        }
      }],
    });
    await alert.present();
  }

}
