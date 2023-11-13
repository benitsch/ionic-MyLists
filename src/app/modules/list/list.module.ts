import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ArticleComponentModule} from "@components/article/article.module";
import {ListPage} from "@modules/list/pages/list/list.page";
import {ListPageRoutingModule} from "@modules/list/list-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    ArticleComponentModule,
  ],
  declarations: [ListPage]
})
export class ListPageModule {
}
