import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validDateRange'
})
export class ValidDateRangePipe implements PipeTransform {
  transform(validFrom: string | null, validUntil: string | null): string {
    if (validFrom && validUntil) {
      return `Gültig von ${this.formatDate(validFrom)} - ${this.formatDate(validUntil)}`;
    } else if (validFrom) {
      return `Gültig ab ${this.formatDate(validFrom)}`;
    } else if (validUntil) {
      return `Gültig bis ${this.formatDate(validUntil)}`;
    }

    return '';
  }

  private formatDate(isoDateString: string): string {
    const date = new Date(isoDateString);
    const day = this.formatNumber(date.getDate());
    const month = this.formatNumber(date.getMonth() + 1);
    
    return `${day}.${month}.`;
  }

  private formatNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
