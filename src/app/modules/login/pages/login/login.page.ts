import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "@data/services/authentication/auth.service";
import {Router} from "@angular/router";
import {AlertController, LoadingController, MenuController} from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  myForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private menuCtrl: MenuController,
  ) {}

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
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email(): FormControl {
    return this.myForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.myForm.get('password') as FormControl;
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

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    const user = await this.authService.login(this.myForm.value);
    await loading.dismiss();

    if (!user){
      this.showAlert('Login fehlgeschlagen', 'Bitte versuche es erneut!');
      return;
    }

    if (!user.user.emailVerified) {
      this.showAlert('Login fehlgeschlagen', 'Dein Account ist noch nicht verifiziert, bitte überprüfe dein E-Mail Postfach.');
      return;
    }

    this.router.navigateByUrl('/home', {replaceUrl: true});
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
