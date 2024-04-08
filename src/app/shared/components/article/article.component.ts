import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Article} from "@data/interfaces/interfaces";
import {DataService} from "@data/services/api/data.service";
import {
  BUY_WITH_DISCOUNT_ICON_PATH,
  BUY_WITH_DISCOUNT_ICON_PATH_DARK,
  IN_SALE_ICON_PATH,
  IN_SALE_ICON_PATH_DARK
} from "@data/constants/constants";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  @ViewChild('checkboxContainer') checkboxContainer!: ElementRef<HTMLElement>;
  @ViewChild('articleName') articleName!: ElementRef<HTMLElement>;
  @Input() article!: Article;
  @Input() listId: string = '';
  @Output() deleteArticleEvent = new EventEmitter<Article>();

  private prefersDark = false;

  constructor(private dataService: DataService) {
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  ngAfterViewChecked() {
    this.addScrollClass();
  }

  deleteArticle(): void {
    this.deleteArticleEvent.emit(this.article);
  }

  getSaleImgPath(): string {
    if (this.prefersDark) {
      return this.article.inSale ? IN_SALE_ICON_PATH_DARK : BUY_WITH_DISCOUNT_ICON_PATH_DARK;
    }
    return this.article.inSale ? IN_SALE_ICON_PATH : BUY_WITH_DISCOUNT_ICON_PATH;
  }

  addScrollClass() {
    if (this.articleName.nativeElement.offsetWidth > this.checkboxContainer.nativeElement.offsetWidth) {
      this.articleName.nativeElement.classList.add('scroll-text');
    }
  }

  onCheckboxChange(): void {
    this.dataService.updateArticle(this.listId, this.article);
  }
}
