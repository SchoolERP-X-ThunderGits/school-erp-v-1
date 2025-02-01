import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyValue'
})
export class KeyValuePipe implements PipeTransform {
  transform(value: Record<string, any>): { key: string; value: any }[] {
    if (!value || typeof value !== 'object') {
      return [];
    }

    // Convert the object into an array of key-value pairs
    return Object.keys(value).map((key) => ({ key, value: value[key] }));
  }

}
