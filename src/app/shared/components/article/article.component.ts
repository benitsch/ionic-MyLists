import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Article} from "@data/interfaces/interfaces";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  @ViewChild('checkboxContainer') checkboxContainer!: ElementRef<HTMLElement>;
  @ViewChild('articleName') articleName!: ElementRef<HTMLElement>;

  @Input() article!: Article;

  @Output() deleteArticleEvent = new EventEmitter<Article>();

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.addScrollClass();
  }

  deleteArticle(): void {
    this.deleteArticleEvent.emit(this.article);
  }

  getSaleImgPath(): string {
    // TODO string path to constant
    return this.article.inSale ? "./assets/icon/action.png" : "./assets/icon/sticker.png";
  }

  addScrollClass() {
    if (this.articleName.nativeElement.offsetWidth > this.checkboxContainer.nativeElement.offsetWidth) {
      this.articleName.nativeElement.classList.add('scroll-text');
    }
  }
}
