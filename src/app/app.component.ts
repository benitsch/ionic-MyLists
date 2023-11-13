import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    {title: 'Listen', url: '/home', icon: 'list-sharp'},
    {title: 'Märkte', url: '/stores', icon: 'storefront-sharp'},
    {title: 'Kategorien', url: '/categories', icon: 'layers-sharp'},
    {title: 'Mein QR-Code', url: '/qr-code', icon: 'qr-code-sharp'},
    {title: 'Einstellungen', url: '/settings', icon: 'settings-sharp'},
  ];

  constructor() {
  }
}
