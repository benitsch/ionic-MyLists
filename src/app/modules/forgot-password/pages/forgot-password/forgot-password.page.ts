import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "@data/services/authentication/auth.service";
import {Router} from "@angular/router";
import {AlertController, LoadingController, MenuController} from "@ionic/angular";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  myForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
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
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email(): FormControl {
    return this.myForm.get('email') as FormControl;
  }

  // async showAlert(header: string, message: string) {
  //   const alert = await this.alertController.create({
  //     header,
  //     message,
  //     buttons: [{
  //       text: 'OK',
  //       handler: () => {
  //         this.router.navigateByUrl('/login', {replaceUrl: true});
  //       }
  //     }],
  //
  //   });
  //   await alert.present();
  // }
  //
  // async resetPassword() {
  //   const loading = await this.loadingController.create();
  //   await loading.present();
  //   const rs = await this.authService.resetPassword(this.myForm.value);
  //   await loading.dismiss();
  //   // TODO refactor functions to showAlert for success and failure.
  //   if (!rs) {
  //     const alert = await this.alertController.create({
  //       header: 'Zurücksetzten fehlgeschlagen',
  //       message: 'Bitte versuche es erneut!',
  //       buttons: ['OK'],
  //     });
  //     await alert.present();
  //     return;
  //   }
  //   this.showAlert('Zurücksetzten erfolgreich', 'Überprüfe dein E-Mail Postfach zum Zurücksetzen des Passworts!');
  // }

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

  async resetPassword() {
    const loading = await this.loadingController.create();
    await loading.present();
    const resetSuccess = await this.authService.resetPassword(this.myForm.value);
    await loading.dismiss();

    if (!resetSuccess) {
      await this.showAlert('Zurücksetzen fehlgeschlagen', 'Bitte versuche es erneut.');
    } else {
      await this.showAlert('Zurücksetzen erfolgreich', 'Überprüfe dein E-Mail-Postfach zum Zurücksetzen des Passworts.', true);
    }
  }


}
