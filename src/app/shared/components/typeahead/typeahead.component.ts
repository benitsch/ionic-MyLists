import {Component, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import type {OnInit} from '@angular/core';
import {DataService} from "@data/services/api/data.service";
import {SuggestedArticle} from "@data/interfaces/interfaces";
import {IonInput} from "@ionic/angular";

@Component({
  selector: 'app-typeahead',
  templateUrl: 'typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
})
export class TypeaheadComponent implements OnInit {
  @ViewChild('articleNameInput') articleNameInput!: IonInput;
  @Input() articleName: string = '';
  @Output() addIconClick = new EventEmitter<string>();
  @Output() suggestionClick = new EventEmitter<SuggestedArticle>();
  @Output() suggestionCancel = new EventEmitter<void>();

  suggestedArticles: SuggestedArticle[] = [];
  filteredSuggestedArticles: SuggestedArticle[] = [];

  constructor(private dataService: DataService)
  {}

  ngOnInit() {
    this.loadArticleSuggestions();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.articleNameInput.setFocus();
    }, 200);
  }

  async loadArticleSuggestions(): Promise<void> {
    this.suggestedArticles = await this.dataService.getArticleSuggestions();
    this.filteredSuggestedArticles = [...this.suggestedArticles];
  }

  close(): void {
    this.suggestionCancel.emit();
  }

  onSuggestionClick(suggestedArticle: SuggestedArticle): void {
    this.suggestionClick.emit(suggestedArticle);
  }

  onAddIconClick(): void {
    if (this.articleName !== '') {
      this.addIconClick.emit(this.articleName.trim());
    }
  }

  searchbarInput(ev: any): void {
    this.filterList(ev.target.value);
  }

  filterList(searchQuery: string | undefined): void {
    if (searchQuery === undefined) {
      this.filteredSuggestedArticles = [...this.suggestedArticles];
    } else {
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredSuggestedArticles = this.suggestedArticles.filter((item: SuggestedArticle) => {
        return item.name.toLowerCase().includes(normalizedQuery);
      });
    }
  }
}
