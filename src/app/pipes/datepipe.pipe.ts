import { Pipe } from '@angular/core'
@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe {
  transform (date: any, clientDateFormat: string): any {
    return this.changeDateFormat(date, clientDateFormat)
  }

  changeDateFormat (date, dateFormat) {
    if (dateFormat === 'd-m-Y') {
      return this.convertToClientDateFormat(date, '-', 'd', 'm', 'Y')
    }
    if (dateFormat === 'd-m-y') {
      return this.convertToClientDateFormat(date, '-', 'd', 'm', 'y')
    }

    if (dateFormat === 'm-d-Y') {
      return this.convertToClientDateFormat(date, '-', 'm', 'd', 'Y')
    }
    if (dateFormat === 'm-d-y') {
      return this.convertToClientDateFormat(date, '-', 'm', 'd', 'y')
    }

    if (dateFormat === 'm/d/Y') {
      return this.convertToClientDateFormat(date, '/', 'm', 'd', 'Y')
    }
    if (dateFormat === 'm/d/y') {
      return this.convertToClientDateFormat(date, '/', 'm', 'd', 'y')
    }

    if (dateFormat === 'd/m/Y') {
      return this.convertToClientDateFormat(date, '/', 'd', 'm', 'Y')
    }
    if (dateFormat === 'd/m/y') {
      return this.convertToClientDateFormat(date, '/', 'd', 'm', 'y')
    }

    if (dateFormat === 'M d y') {
      return this.convertToClientDateFormat(date, ' ', 'M', 'd', 'y')
    }
    if (dateFormat === 'M d Y') {
      return this.convertToClientDateFormat(date, ' ', 'M', 'd', 'Y')
    }
    if (dateFormat === 'd M y') {
      return this.convertToClientDateFormat(date, ' ', 'd', 'M', 'y')
    }
    if (dateFormat === 'd M Y') {
      return this.convertToClientDateFormat(date, ' ', 'd', 'M', 'Y')
    }

    if (dateFormat === 'M-d-y') {
      return this.convertToClientDateFormat(date, '-', 'M', 'd', 'y')
    }
    if (dateFormat === 'M-d-Y') {
      return this.convertToClientDateFormat(date, '-', 'M', 'd', 'Y')
    }
    if (dateFormat === 'd-M-y') {
      return this.convertToClientDateFormat(date, '-', 'd', 'M', 'y')
    }
    if (dateFormat === 'd-M-Y') {
      return this.convertToClientDateFormat(date, '-', 'd', 'M', 'Y')
    }

    if (dateFormat === 'M/d/y') {
      return this.convertToClientDateFormat(date, '/', 'M', 'd', 'y')
    }
    if (dateFormat === 'M/d/Y') {
      return this.convertToClientDateFormat(date, '/', 'M', 'd', 'Y')
    }
    if (dateFormat === 'd/M/y') {
      return this.convertToClientDateFormat(date, '/', 'd', 'M', 'y')
    }
    if (dateFormat === 'd/M/Y') {
      return this.convertToClientDateFormat(date, '/', 'd', 'M', 'Y')
    }

    if (dateFormat === 'M.d.y') {
      return this.convertToClientDateFormat(date, '.', 'M', 'd', 'y')
    }
    if (dateFormat === 'M.d.Y') {
      return this.convertToClientDateFormat(date, '.', 'M', 'd', 'Y')
    }
    if (dateFormat === 'd.M.y') {
      return this.convertToClientDateFormat(date, '.', 'd', 'M', 'y')
    }
    if (dateFormat === 'd.M.Y') {
      return this.convertToClientDateFormat(date, '.', 'd', 'M', 'Y')
    }

    if (dateFormat === 'd.m.Y') {
      return this.convertToClientDateFormat(date, '.', 'd', 'm', 'Y')
    }
    if (dateFormat === 'd.m.y') {
      return this.convertToClientDateFormat(date, '.', 'd', 'm', 'y')
    }

    if (dateFormat === 'm.d.Y') {
      return this.convertToClientDateFormat(date, '.', 'm', 'd', 'Y')
    }
    if (dateFormat === 'm.d.y') {
      return this.convertToClientDateFormat(date, '.', 'm', 'd', 'y')
    }
  }

  convertToClientDateFormat (date, splitter, first, second, last) {
    const months = ['Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ]
    let d = new Date(date)
    let day = d.getDate().toString()
    let year = d.getFullYear().toString()
    let month = d.getMonth().toString()
    if (last === 'y') {
      year = year.substring(2,4)
    }
    if (first === 'M' || second === 'M') {
      month = months[month]
    }
    if (first === 'm' || second === 'm') {
      month = '' + (+month + 1)
    }
    if ((first === 'm' || second === 'm') && +month < 10) {
      month = '0' + month
    }
    if (+day < 10) {
      day = '0' + day
    }

    let dateToSend = ''
    if (first === 'd') {
      dateToSend = day + splitter + month + splitter + year
    } else {
      dateToSend = month + splitter + day + splitter + year
    }
    return dateToSend
  }
}
