import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AddArticleModalPage} from "@modules/list/pages/addArticle/addArticleModal.page";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TypeaheadComponent} from "@components/typeahead/typeahead.component";
import {AddListModalPage} from "@modules/home/pages/addList/addListModal.page";

@NgModule({
  declarations: [AppComponent, AddArticleModalPage, TypeaheadComponent, AddListModalPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
