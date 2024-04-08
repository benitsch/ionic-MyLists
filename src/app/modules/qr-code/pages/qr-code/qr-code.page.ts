import {Component, OnInit} from '@angular/core';
import {AuthService} from "@data/services/authentication/auth.service";

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
})
export class QrCodePage implements OnInit {
  userId: string = '';

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.setupUserId();
  }

  setupUserId() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.userId = userId;
    }
  }
}
