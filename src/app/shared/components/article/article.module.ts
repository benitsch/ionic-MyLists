import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {DatePipe} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ArticleComponent} from "@components/article/article.component";
import {ValidDateRangePipe} from "@shared/pipes/ValidDateRangePipe";


@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  declarations: [ArticleComponent, ValidDateRangePipe],
  providers: [DatePipe],
  exports: [ArticleComponent]
})
export class ArticleComponentModule {
}
