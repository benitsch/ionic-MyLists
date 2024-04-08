import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AddArticleModalPage} from "@modules/list/pages/addArticle/addArticleModal.page";
import {FormsModule, ReactiveFormsModule} from "@angular/forms"; // TODO check if ReactiveFormsModule is necessary in global app or better in sub pages modules
import {TypeaheadComponent} from "@components/typeahead/typeahead.component";
import {AddListModalPage} from "@modules/home/pages/addList/addListModal.page";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {environment} from "../environments/environment";

@NgModule({
  declarations: [AppComponent, AddArticleModalPage, TypeaheadComponent, AddListModalPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
