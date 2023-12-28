import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'articleName'
})
export class ArticleName implements PipeTransform {
  transform(articleName: string | null, amount: number | null): string {
    if (articleName && amount) {
      if (amount > 1) {
        return `${amount}x ${articleName}`;
      }
      return articleName;
    }

    return '';
  }
}
