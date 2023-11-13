import {Component, Output, EventEmitter, inject, Input} from '@angular/core';
import type {OnInit} from '@angular/core';
import {DataService} from "@data/services/api/data.service";

@Component({
  selector: 'app-typeahead',
  templateUrl: 'typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
})
export class TypeaheadComponent implements OnInit {
  @Input() articleName: string = '';
  @Output() suggestionClick = new EventEmitter<string>();
  @Output() suggestionCancel = new EventEmitter<void>();

  items: string[] = [];
  filteredItems: string[] = [];

  private dataService = inject(DataService);

  ngOnInit() {
    this.items = this.dataService.getArticleSuggestions();
    this.filteredItems = [...this.items];
  }

  close(): void {
    this.suggestionCancel.emit();
  }

  onSuggestionClick(articleName: any): void {
    this.suggestionClick.emit(articleName);
  }

  onAddIconClick(): void {
    if (this.articleName !== '') {
      this.suggestionClick.emit(this.articleName.trim());
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
      this.filteredItems = [...this.items];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((item: string) => {
        return item.toLowerCase().includes(normalizedQuery);
      });
    }
  }
}
