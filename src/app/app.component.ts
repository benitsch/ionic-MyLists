import {Component} from '@angular/core';
import {AuthService} from "@data/services/authentication/auth.service";
import {Router} from "@angular/router";
import {MenuController} from "@ionic/angular";
import {DataService} from "@data/services/api/data.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    {title: 'Listen', url: '/home', icon: 'list-sharp'},
    {title: 'Märkte', url: '/stores', icon: 'storefront-sharp'},
    // {title: 'Kategorien', url: '/categories', icon: 'layers-sharp'},
    {title: 'Mein QR-Code', url: '/qr-code', icon: 'qr-code-sharp'},
    // {title: 'Einstellungen', url: '/settings', icon: 'settings-sharp'},
  ];

  imagePath = 'assets/avatar/default.png';

  // TODO Move the side menu to home page, because it's not needed to enable-disable on view enter/leave on login/register/forgot-pw page.
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private menuCtrl: MenuController,
  ) {
  }

  ngOnInit() {
    // this.setUserAvatarImagePath();
  }

  currentUserName(): string | null | undefined {
    return this.authService.getCurrentUser()?.displayName;
  }

  currentUserEmail(): string | null | undefined {
    return this.authService.getCurrentUser()?.email;
  }

  // TODO Load avatar from user (check how to load avatar when user is not ready loaded): 

  // setUserAvatarImagePath() {
  //   console.log('setUserAvatarImagePath');
  //   console.log(this.currentUserEmail());
  //   const userId = this.authService.getCurrentUser()?.uid;
  //   console.log(userId);
  //   if (!userId) {
  //     return;
  //   }
  //
  //   this.dataService.getUserAvatar(userId).then((val:any) => {
  //     console.log("then:", val);
  //     const avatar: string|null = val;
  //     if (avatar) {
  //       this.imagePath = `assets/avatar/${avatar}.png`;
  //     }
  //   })
  // }
  //
  // getUserAvatarImagePath() {
  //   console.log('getUserAvatarImagePath');
  //   const userId = this.authService.getCurrentUser()?.uid;
  //   console.log(userId);
  //   if (!userId) {
  //     return;
  //   }
  //
  //   this.dataService.getUserAvatar(userId).then((val:any) => {
  //     console.log("then:", val);
  //     const avatar: string|null = val;
  //     if (avatar) {
  //       this.imagePath = `assets/avatar/${avatar}.png`;
  //     }
  //   })
  // }

  async logout() {
    // TODO Page load transition from ionic is not beautiful & smooth.
    await this.authService.logout();
    this.router.navigateByUrl('/', {replaceUrl: true});
  }

  navigateToUserEdit() {
    this.menuCtrl.close();
    this.router.navigateByUrl('/user-edit');
  }
}
