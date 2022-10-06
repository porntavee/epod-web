import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'datetimeFormat'
})
export class DatetimeFormatPipe implements PipeTransform {

  transform(param: string) {
    if (param == null || param == '')
      return '-';
    else
      return moment(param, 'YYYYMMDDhhmmss').format('DD-MM-YYYY HH:mm:ss');
  }
  public static transform(param: string) {
    if (param == null || param == '')
      return '-';
    else
      return moment(param, 'YYYYMMDDhhmmss').format('DD-MM-YYYY HH:mm:ss');
  }
}
