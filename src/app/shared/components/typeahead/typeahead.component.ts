import {Component, Output, EventEmitter, inject, Input} from '@angular/core';
import type {OnInit} from '@angular/core';
import {DataService} from "@data/services/api/data.service";
import {SuggestedArticle} from "@data/interfaces/interfaces";

@Component({
  selector: 'app-typeahead',
  templateUrl: 'typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
})
export class TypeaheadComponent implements OnInit {
  @Input() articleName: string = '';
  @Output() addIconClick = new EventEmitter<string>();
  @Output() suggestionClick = new EventEmitter<SuggestedArticle>();
  @Output() suggestionCancel = new EventEmitter<void>();

  suggestedArticles: SuggestedArticle[] = [];
  filteredSuggestedArticles: SuggestedArticle[] = [];

  private dataService = inject(DataService);

  ngOnInit() {
    this.loadArticleSuggestions();
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

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  filterList(searchQuery: string | undefined): void {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined) {
      this.filteredSuggestedArticles = [...this.suggestedArticles];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredSuggestedArticles = this.suggestedArticles.filter((item: SuggestedArticle) => {
        return item.name.toLowerCase().includes(normalizedQuery);
      });
    }
  }
}
