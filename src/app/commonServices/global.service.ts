import { Injectable } from '@angular/core'
import { Settings } from '../shared/constants/settings.constant'
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  clientDateFormat: string = ''
  constructor (private settings: Settings) {}
  isValidDate (dateString) {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dateString)) {
      return false
    }

  // Parse the date parts to integers
    let parts = dateString.split('/')
    let day = parseInt(parts[1], 10)
    let month = parseInt(parts[0], 10)
    let year = parseInt(parts[2], 10)

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month === 0 || month > 12) {
      return false
    }

    let monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]

    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      monthLength[1] = 29
    }

  // Check the range of the day
    return day > 0 && day <= monthLength[month - 1]
  }

  checkForValidDayAndMonth (date) {
    date = this.clientToSqlDateFormat(date, this.settings.dateFormat)
    if (this.isValidDate(date)) {
      let parts = date.split('/')
      let day = '' + parseInt(parts[1], 10)
      let month = '' + parseInt(parts[0], 10)
      let year = '' + parseInt(parts[2], 10)

      if (+day < 10) {
        day = '0' + day
      }
      if (+month < 10) {
        month = '0' + month
      }
      return month + '/' + day + '/' + year
    } else {
      return ''
    }
  }

  validReturnDate (d1, d2): boolean {
    // check if date 2 is greater then date 1
    if (!d2) {
      return true
    } else {
      d2 = this.clientToSqlDateFormat(d2, this.settings.dateFormat)
      if (this.isValidDate(d2)) {
        d2 = new Date(d2)
        // this.toastrService.showError('', 'Invalid Return Date')
      } else {
        return false
      }
    }
    if (!d1) {
      return true
    } else {
      d1 = this.clientToSqlDateFormat(d1, this.settings.dateFormat)
      if (this.isValidDate(d1)) {
        d1 = new Date(d1)
        // this.toastrService.showError('', 'Invalid Travel Date')
      } else {
        return false
      }
    }
    // console.log('d1.getTime() <= d2.getTime() : ', d1.getTime(), d2.getTime())
    return d1.getTime() <= d2.getTime()
  }

  removeSpecialCharacters (arr) {
    for (let i = 0; i <= arr.length - 1; i++) {
      arr[i] = arr[i].replace(/[^\w\s\r\t\n]/gi, '')
      arr[i] = arr[i].trim().toUpperCase()
    }
    return arr
  }

  removeSpecialCharacter (str) {
    str = str.replace(/[^\w\s\r\t\n]/gi, '')
    str = str.trim().toUpperCase()
    return str
  }

  checkForEqualityInArray (arr1, arr2): string {
    arr1 = arr1.sort()
    arr2 = arr2.sort()
    // console.log('arr1 : ', arr1)
    // console.log('arr2 : ', arr2)
    for (let i = 0; i <= arr1.length - 1; i++) {
      if (arr1[i].trim().toUpperCase() !== arr2[i].trim().toUpperCase()) {
        return arr1[i]
      }
    }
    return ''
  }

  checkForValidNumbers (num) {
    const amount = /^[0-9.]+$/
    num = +num
    return amount.test(num)
  }

  merge (leftArr, rightArr) {
    let sortedArr = []
    while (leftArr.length && rightArr.length) {
      if (leftArr[0].NAME.localeCompare(rightArr[0].NAME) <= 0) {
        sortedArr.push(leftArr[0])
        leftArr = leftArr.slice(1)
      } else {
        sortedArr.push(rightArr[0])
        rightArr = rightArr.slice(1)
      }
    }
    while (leftArr.length) {
      sortedArr.push(leftArr.shift())
    }
    while (rightArr.length) {
      sortedArr.push(rightArr.shift())
    }
    return sortedArr
  }

  mergesort (arr) {
    if (arr.length < 2) {
      return arr
    } else {
      let midpoint = +(arr.length / 2)
      let leftArr = arr.slice(0, midpoint)
      let rightArr = arr.slice(midpoint, arr.length)
      return this.merge(this.mergesort(leftArr), this.mergesort(rightArr))
    }
  }

  changeSno (arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i]['SNO'] = i + 1
    }
    return arr
  }

  convertToSqlFormat (date) {
    const d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    if (+month < 10) {
      month = '0' + month
    }
    return month + '/' + d.getDate() + '/' + d.getFullYear()
  }

  getDefaultDate (clientDateFormat) {
    let date = new Date()
    return this.checkForFormat(4, date, clientDateFormat)
  }

  /*
  case - UTC TO CLIENTDATEFORMAT - 1
  case - CLIENTDATEFORMAT TO SQLDATEFORMAT - 2
  case - SQLDATEFORMAT TO UTC - 3
  case - DEFAULT DATE - 4
  */

  utcToClientDateFormat (utcDate, clientDateFormat): string {
    return this.checkForFormat(1, utcDate, clientDateFormat)
  }

  clientToSqlDateFormat (clientFormatDate, clientDateFormat): string {
    return this.checkForFormat(2, clientFormatDate, clientDateFormat)
  }

  checkForFormat (type, date, clientDateFormat) {
    if (clientDateFormat === 'd-m-Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '-', 'd', 'm', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '-', 'd', 'm', 'Y')
      } else if (type === 3) {
        return '-'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '-', 'd', 'm', 'Y')
      }
    }
    if (clientDateFormat === 'd-m-y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '-', 'd', 'm', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '-', 'd', 'm', 'y')
      } else if (type === 3) {
        return '-'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '-', 'd', 'm', 'y')
      }
    }

    if (clientDateFormat === 'm-d-Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '-', 'm', 'd', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '-', 'm', 'd', 'Y')
      } else if (type === 3) {
        return '-'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '-', 'm', 'd', 'Y')
      }
    }
    if (clientDateFormat === 'm-d-y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '-', 'm', 'd', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '-', 'm', 'd', 'y')
      } else if (type === 3) {
        return '-'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '-', 'm', 'd', 'y')
      }
    }

    if (clientDateFormat === 'm/d/Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '/', 'm', 'd', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '/', 'm', 'd', 'Y')
      } else if (type === 3) {
        return '/'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '/', 'm', 'd', 'Y')
      }
    }
    if (clientDateFormat === 'm/d/y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '/', 'm', 'd', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '/', 'm', 'd', 'y')
      } else if (type === 3) {
        return '/'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '/', 'm', 'd', 'y')
      }
    }

    if (clientDateFormat === 'd/m/Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '/', 'd', 'm', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '/', 'd', 'm', 'Y')
      } else if (type === 3) {
        return '/'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '/', 'd', 'm', 'Y')
      }
    }
    if (clientDateFormat === 'd/m/y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '/', 'd', 'm', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '/', 'd', 'm', 'y')
      } else if (type === 3) {
        return '/'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '/', 'd', 'm', 'y')
      }
    }

    if (clientDateFormat === 'M d y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, ' ', 'M', 'd', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, ' ', 'M', 'd', 'y')
      } else if (type === 3) {
        return ' '
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, ' ', 'M', 'd', 'y')
      }
    }
    if (clientDateFormat === 'M d Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, ' ', 'M', 'd', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, ' ', 'M', 'd', 'Y')
      } else if (type === 3) {
        return ' '
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, ' ', 'M', 'd', 'Y')
      }
    }
    if (clientDateFormat === 'd M y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, ' ', 'd', 'M', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, ' ', 'd', 'M', 'y')
      } else if (type === 3) {
        return ' '
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, ' ', 'd', 'M', 'y')
      }
    }
    if (clientDateFormat === 'd M Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, ' ', 'd', 'M', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, ' ', 'd', 'M', 'Y')
      } else if (type === 3) {
        return ' '
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, ' ', 'd', 'M', 'Y')
      }
    }

    if (clientDateFormat === 'M-d-y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '-', 'M', 'd', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '-', 'M', 'd', 'y')
      } else if (type === 3) {
        return '-'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '-', 'M', 'd', 'y')
      }
    }
    if (clientDateFormat === 'M-d-Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '-', 'M', 'd', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '-', 'M', 'd', 'Y')
      } else if (type === 3) {
        return '-'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '-', 'M', 'd', 'Y')
      }
    }
    if (clientDateFormat === 'd-M-y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '-', 'd', 'M', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '-', 'd', 'M', 'y')
      } else if (type === 3) {
        return '-'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '-', 'd', 'M', 'y')
      }
    }
    if (clientDateFormat === 'd-M-Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '-', 'd', 'M', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '-', 'd', 'M', 'Y')
      } else if (type === 3) {
        return '-'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '-', 'd', 'M', 'Y')
      }
    }

    if (clientDateFormat === 'M/d/y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '/', 'M', 'd', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '/', 'M', 'd', 'y')
      } else if (type === 3) {
        return '/'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '/', 'M', 'd', 'y')
      }
    }
    if (clientDateFormat === 'M/d/Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '/', 'M', 'd', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '/', 'M', 'd', 'Y')
      } else if (type === 3) {
        return '/'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '/', 'M', 'd', 'Y')
      }
    }
    if (clientDateFormat === 'd/M/y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '/', 'd', 'M', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '/', 'd', 'M', 'y')
      } else if (type === 3) {
        return '/'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '/', 'd', 'M', 'y')
      }
    }
    if (clientDateFormat === 'd/M/Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '/', 'd', 'M', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '/', 'd', 'M', 'Y')
      } else if (type === 3) {
        return '/'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '/', 'd', 'M', 'Y')
      }
    }

    if (clientDateFormat === 'M.d.y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '.', 'M', 'd', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '.', 'M', 'd', 'y')
      } else if (type === 3) {
        return '.'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '.', 'M', 'd', 'y')
      }
    }
    if (clientDateFormat === 'M.d.Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '.', 'M', 'd', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '.', 'M', 'd', 'Y')
      } else if (type === 3) {
        return '.'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '.', 'M', 'd', 'Y')
      }
    }
    if (clientDateFormat === 'd.M.y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '.', 'd', 'M', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '.', 'd', 'M', 'y')
      } else if (type === 3) {
        return '.'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '.', 'd', 'M', 'y')
      }
    }
    if (clientDateFormat === 'd.M.Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '.', 'd', 'M', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '.', 'd', 'M', 'Y')
      } else if (type === 3) {
        return '.'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '.', 'd', 'M', 'Y')
      }
    }

    if (clientDateFormat === 'd.m.Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '.', 'd', 'm', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '.', 'd', 'm', 'Y')
      } else if (type === 3) {
        return '.'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '.', 'd', 'm', 'Y')
      }
    }
    if (clientDateFormat === 'd.m.y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '.', 'd', 'm', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '.', 'd', 'm', 'y')
      } else if (type === 3) {
        return '.'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '.', 'd', 'm', 'y')
      }
    }

    if (clientDateFormat === 'm.d.Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '.', 'm', 'd', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '.', 'm', 'd', 'Y')
      } else if (type === 3) {
        return '.'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '.', 'm', 'd', 'Y')
      }
    }
    if (clientDateFormat === 'm.d.y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '.', 'm', 'd', 'y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '.', 'm', 'd', 'y')
      } else if (type === 3) {
        return '.'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '.', 'm', 'd', 'y')
      }
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

  convertFromClientToSql (date, splitter, first, second, last) {
    const months = ['Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ]
    let day = ''
    let month = ''
    let year = ''
    let parts = date.split(splitter)
    year = '' + parseInt(parts[2], 10)
    if (first === 'd' && second === 'm') {
      day = '' + parseInt(parts[0], 10)
      month = '' + parseInt(parts[1], 10)
    } else if (first === 'm' && second === 'd') {
      day = '' + parseInt(parts[1], 10)
      month = '' + parseInt(parts[0], 10)
    } else if (first === 'M' && second === 'd') {
      let month1 = parts[0]
      month = '' + (months.indexOf(month1) + 1)
      day = '' + parseInt(parts[1], 10)
    } else if (first === 'd' && second === 'M') {
      let month1 = parts[1]
      month = '' + (months.indexOf(month1) + 1)
      day = '' + parseInt(parts[0], 10)
    }
    if (+day < 10) {
      day = '0' + day
    }
    if ((first === 'm' || second === 'm') && +month < 10) {
      month = '0' + month
    }
    if (last === 'y') {
      let newDate = month + '/' + day + '/' + year
      year = '' + new Date(this.sqlToUtc(newDate)).getFullYear()
    }
    return month + '/' + day + '/' + year
  }

  sqlToUtc (date) {
    let newDate = new Date(date).toISOString()
    return newDate
  }
}
