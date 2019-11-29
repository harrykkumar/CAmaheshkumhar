import { Injectable } from '@angular/core'
import { Settings } from '../shared/constants/settings.constant'
import { SetUpIds } from '../shared/constants/setupIds.constant';
import { Observable, throwError } from 'rxjs';
import { ResponseSale } from '../model/sales-tracker.model';
import { filter, map } from 'rxjs/operators';
import { UIConstant } from '../shared/constants/ui-constant';
import { catchError } from 'rxjs/internal/operators/catchError';
import * as _ from 'lodash';
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

  checkForValidDayAndMonthForImport (date) {
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

  validReturnDateForImport (d1, d2): boolean {
    // console.log(d1, d2)
    // check if date 2 is greater then date 1
    if (!d2) {
      return true
    } else {
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
      if (arr[i]) {
        arr[i] = arr[i].replace(/[^\w\s\r\t\n]/gi, '')
        arr[i] = arr[i].trim().toUpperCase()
      } else {
        arr[i] = ''
      }
    }
    return arr
  }

  removeSpecialCharacter (str) {
    str = '' + str
    if (str) {
      str = str.replace(/[^\w\s\r\t\n]/gi, '')
      str = str.trim()
      return str
    } else {
      return ''
    }
  }

  checkForEqualityInArray (arr1, arr2): string {
    arr1 = arr1.splice(0).sort()
    arr2 = arr2.splice(0).sort()
    // console.log('arr1 : ', arr1)
    // console.log('arr2 : ', arr2)
    if (arr1.length > arr2.length) {
      let diff = _.differenceWith(arr1, arr2)
      let str = ''
      if (diff.length > 1) {
        str = 'PARAMETERS ARE MISSING, PLEASE ADD THE COLUMNS INORDER TO UPLOAD THE SHEET'
      } else {
        str = 'PARAMETER IS MISSING, PLEASE ADD THE COLUMN INORDER TO UPLOAD THE SHEET'
      }
      return diff.join(',') + ' ' + str
    } else if (arr1.length < arr2.length) {
      let diff = _.differenceWith(arr2, arr1)
      let str = ''
      if (diff.length > 1) {
        str = 'PARAMETERS ARE EXTRA, PLEASE REMOVE THE COLUMNS INORDER TO UPLOAD THE SHEET'
      } else {
        str = 'PARAMETER IS EXTRA, PLEASE REMOVE THE COLUMN INORDER TO UPLOAD THE SHEET'
      }
      return diff.join(',') + ' ' + str
    } else {
      for (let i = 0; i <= arr1.length - 1; i++) {
        if (arr1[i].trim().toUpperCase() !== arr2[i].trim().toUpperCase()) {
          return arr2[i] + ' ' + 'doesn\'t match, please correct the key name to ' + arr1[i]
        }
      }
      return ''
    }
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
  case - DATE IN PARTS - 5
  case - CHECK FOR FORMAT - 6
  case - GET PLACEHOLDER - 7
  case - GET CHARACTERS - 8
  */

  utcToClientDateFormat (utcDate, clientDateFormat): any {
    return this.checkForFormat(1, utcDate, clientDateFormat)
  }

  clientToSqlDateFormat (clientFormatDate, clientDateFormat): any {
    return this.checkForFormat(2, clientFormatDate, clientDateFormat)
  }

  checkForFormatType (clientDateFormat): any {
    return this.checkForFormat(6, '', clientDateFormat)
  }

  convertToInParts (clientFormatDate, clientDateFormat): any {
    return this.checkForFormat(5, clientFormatDate, clientDateFormat)
  }

  getPlaceholder (clientDateFormat): string {
    return this.checkForFormat(7, '', clientDateFormat)
  }

  getCharaters (clientDateFormat): any {
    return this.checkForFormat(8, '', clientDateFormat)
  }

  checkForFormat (type, date, clientDateFormat): any {
    if (clientDateFormat === 'd-m-Y') {
      if (type === 1) {
        return this.convertToClientDateFormat(date, '-', 'd', 'm', 'Y')
      } else if (type === 2) {
        return this.convertFromClientToSql(date, '-', 'd', 'm', 'Y')
      } else if (type === 3) {
        return '-'
      } else if (type === 4) {
        return this.convertToClientDateFormat(date, '-', 'd', 'm', 'Y')
      } else if (type === 5) {
        return this.dateInParts(date, '-', 'd', 'm', 'Y')
      } else if (type === 6) {
        return 1
      } else if (type === 7) {
        return 'DD-MM-YYYY'
      } else if (type === 8) {
        return [2, 2, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, '-', 'd', 'm', 'y')
      } else if (type === 6) {
        return 1
      } else if (type === 7) {
        return 'DD-MM-YY'
      } else if (type === 8) {
        return [2, 2, 2]
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
      } else if (type === 5) {
        return this.dateInParts(date, '-', 'm', 'd', 'Y')
      } else if (type === 6) {
        return 1
      } else if (type === 7) {
        return 'MM-DD-YYYY'
      } else if (type === 8) {
        return [2, 2, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, '-', 'm', 'd', 'y')
      } else if (type === 6) {
        return 1
      } else if (type === 7) {
        return 'MM-DD-YY'
      } else if (type === 8) {
        return [2, 2, 2]
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
      } else if (type === 5) {
        return this.dateInParts(date, '/', 'm', 'd', 'Y')
      } else if (type === 6) {
        return 1
      } else if (type === 7) {
        return 'MM/DD/YYYY'
      } else if (type === 8) {
        return [2, 2, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, '/', 'm', 'd', 'y')
      } else if (type === 6) {
        return 1
      } else if (type === 7) {
        return 'MM/DD/YY'
      } else if (type === 8) {
        return [2, 2, 2]
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
      } else if (type === 5) {
        return this.dateInParts(date, '/', 'd', 'm', 'Y')
      } else if (type === 6) {
        return 1
      } else if (type === 7) {
        return 'DD/MM/YYYY'
      } else if (type === 8) {
        return [2, 2, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, '/', 'd', 'm', 'y')
      } else if (type === 6) {
        return 1
      } else if (type === 7) {
        return 'DD/MM/YY'
      } else if (type === 8) {
        return [2, 2, 2]
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
      } else if (type === 5) {
        return this.dateInParts(date, ' ', 'M', 'd', 'y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'MMM DD YY'
      } else if (type === 8) {
        return [3, 2, 2]
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
      } else if (type === 5) {
        return this.dateInParts(date, ' ', 'M', 'd', 'Y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'MMM DD YYYY'
      } else if (type === 8) {
        return [3, 2, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, ' ', 'd', 'M', 'y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'DD MMM YY'
      } else if (type === 8) {
        return [2, 3, 2]
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
      } else if (type === 5) {
        return this.dateInParts(date, ' ', 'd', 'M', 'Y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'DD MMM YYYY'
      } else if (type === 8) {
        return [2, 3, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, '-', 'M', 'd', 'y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'MMM-DD-YY'
      } else if (type === 8) {
        return [3, 2, 2]
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
      } else if (type === 5) {
        return this.dateInParts(date, '-', 'M', 'd', 'Y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'MMM-DD-YYYY'
      } else if (type === 8) {
        return [3, 2, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, '-', 'd', 'M', 'y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'DD-MMM-YY'
      } else if (type === 8) {
        return [2, 3, 2]
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
      } else if (type === 5) {
        return this.dateInParts(date, '-', 'd', 'M', 'Y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'DD-MMM-YYYY'
      } else if (type === 8) {
        return [2, 3, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, '/', 'M', 'd', 'y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'MMM/DD/YY'
      } else if (type === 8) {
        return [3, 2, 2]
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
      } else if (type === 5) {
        return this.dateInParts(date, '/', 'M', 'd', 'Y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'MMM/DD/YYYY'
      } else if (type === 8) {
        return [3, 2, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, '/', 'd', 'M', 'y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'DD/MMM/YY'
      } else if (type === 8) {
        return [2, 3, 2]
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
      } else if (type === 5) {
        return this.dateInParts(date, '/', 'd', 'M', 'Y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'DD/MMM/YYYY'
      } else if (type === 8) {
        return [2, 3, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, '.', 'M', 'd', 'y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'MMM.DD.YY'
      } else if (type === 8) {
        return [3, 2, 2]
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
      } else if (type === 5) {
        return this.dateInParts(date, '.', 'M', 'd', 'Y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'MMM.DD.YYYY'
      } else if (type === 8) {
        return [3, 2, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, '.', 'd', 'M', 'y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'DD.MMM.YY'
      } else if (type === 8) {
        return [2, 3, 2]
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
      } else if (type === 5) {
        return this.dateInParts(date, '.', 'd', 'M', 'Y')
      } else if (type === 6) {
        return 2
      } else if (type === 7) {
        return 'DD.MMM.YYYY'
      } else if (type === 8) {
        return [2, 3, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, '.', 'd', 'm', 'Y')
      } else if (type === 6) {
        return 1
      } else if (type === 7) {
        return 'DD.MM.YYYY'
      } else if (type === 8) {
        return [2, 2, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, '.', 'd', 'm', 'y')
      } else if (type === 6) {
        return 1
      } else if (type === 7) {
        return 'DD.MM.YY'
      } else if (type === 8) {
        return [2, 2, 2]
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
      } else if (type === 5) {
        return this.dateInParts(date, '.', 'm', 'd', 'Y')
      } else if (type === 6) {
        return 1
      } else if (type === 7) {
        return 'MM.DD.YYYY'
      } else if (type === 8) {
        return [2, 2, 4]
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
      } else if (type === 5) {
        return this.dateInParts(date, '.', 'm', 'd', 'y')
      } else if (type === 6) {
        return 1
      } else if (type === 7) {
        return 'MM.DD.YY'
      } else if (type === 8) {
        return [2, 2, 2]
      }
    }
  }

  dateInParts (date, splitter, first, second, last): any {
    if (date) {
      let day = -1
      let month = -1
      let year = -1
      let parts = date.split(splitter)
      year = parseInt(parts[2], 10)
      if (first === 'd' && second === 'm') {
        day = parseInt(parts[0], 10)
        month = parseInt(parts[1], 10)
      } else if (first === 'm' && second === 'd') {
        day = parseInt(parts[1], 10)
        month = parseInt(parts[0], 10)
      }
      if (last === 'y') {
        let newDate = month + '/' + day + '/' + year
        year = new Date(this.sqlToUtc(newDate)).getFullYear()
      }
      const isValidDate = this.isValidDate(month + '/' + day + '/' + year)
      if (isValidDate) {
        return [year, month - 1, day]
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  convertToClientDateFormat (date, splitter, first, second, last) {
    if (date) {
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
      if (+month < 10) {
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
    } else {
      return ''
    }
  }

  convertFromClientToSql (date, splitter, first, second, last) {
    if (date) {
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
      if (+month < 10) {
        month = '0' + month
      }
      if (last === 'y') {
        let newDate = month + '/' + day + '/' + year
        year = '' + new Date(this.sqlToUtc(newDate)).getFullYear()
      }
      // console.log(month + '/' + day + '/' + year)
      return month + '/' + day + '/' + year
    } else {
      return ''
    }
  }

  sqlToUtc (date) {
    let newDate = new Date(date).toISOString()
    return newDate
  }

  todayInUtc (): string {
    let date = new Date()
    return date.toISOString()
  }

  setDueDate (creditDays, clientDateFormat) {
    const d = new Date()
    d.setDate(d.getDate() + creditDays)
    return this.checkForFormat(4, d, clientDateFormat)
  }

  getAllSettings (settings, moduleId) {
   return new Promise(
     async (resolve, reject) => {
      let setting = []
      let setupMasters = settings.SetupMasters
      let setupClient = settings.SetupClients
      // console.log(setupClient, setupMasters)
      await  setupMasters.forEach(
       async (element) => {
        let val: string | Array<any> | boolean | number
        let name = element.SetupName
        if (+element.Type === SetUpIds.singleId) {
          let setupclient = setupClient.filter(setup => setup.SetupId === element.Id)
          if(setupclient.length>0) {
            val = setupclient[0].Id
          }
        }
        if (+element.Type === SetUpIds.singleVal) {
          let setupclient = setupClient.filter(setup => setup.SetupId === element.Id)
          val = setupclient
        }
        if (+element.Type === SetUpIds.getStrOrNum || +element.Type === SetUpIds.baseTypeNum) {
          let setupclient = setupClient.filter(setup => setup.SetupId === element.Id)
          if(setupclient.length > 0) {
            val = setupclient[0].Val
          }
        }
        if (+element.Type === SetUpIds.multiple) {
          let setupclient = setupClient.filter(setup => setup.SetupId === element.Id)
          // console.log(setupclient) /*setupclient[0].Val.split(',') */
          val = setupclient
        }
        if (+element.Type === SetUpIds.getBoolean) {
          let setupclient = setupClient.filter(setup => setup.SetupId === element.Id)
          if(setupclient.length > 0) {
            val = !!(+setupclient[0].Val)
          }
        }
        await setting.push({
          id: element.Id,
          val: val,
          name: name
        })
      })
      this.settings.moduleSettings = JSON.stringify({settings: setting, moduleId: moduleId})
      if (setting.length > 0) {
      await setting.forEach(
        (element) => {
          if (+element.id === +SetUpIds.dateFormat) {
            this.clientDateFormat = element.val[0].Val
            this.settings.dateFormat = element.val[0].Val
            return
          }
          if (+element.id === +SetUpIds.noOfDecimalPoint) {
              this.settings.noOfDecimal = element.val
            return 
          }
        });
      }
      resolve('Setting set up success');
    })
  }

  convertToClient (date, clientDateFormat): string {
    let newDate = '' + (new Date(date))
    // console.log(newDate)
    if (newDate !== 'Invalid Date') {
      const toReturn = this.utcToClientDateFormat(this.sqlToUtc(date), clientDateFormat)
      return toReturn
    } else {
      return ''
    }
  }

  manipulateResponse (obs: Observable<any>): Observable<any> {
    return obs.pipe(filter((data: ResponseSale) => {
      if (data.Code === UIConstant.THOUSAND || 
        data.Code === UIConstant.DELETESUCCESS || 
        data.Code === UIConstant.PARTIALLY_SAVED) { return true } else { throw new Error(data.Description) }
    }), catchError(error => throwError(error) ), map((data: ResponseSale) => data.Data))
  }

  allPossibleCases(arr) {
    if (arr.length > 0) {
      if (arr.length == 1) {
        return arr[0];
      } else {
        var result = [];
        var allCasesOfRest = this.allPossibleCases(arr.slice(1));
        for (var i = 0; i < allCasesOfRest.length; i++) {
          for (var j = 0; j < arr[0].length; j++) {
            result.push(arr[0][j] + ',' + allCasesOfRest[i]);
          }
        }
        return result;
      }
    }
  }

  compareDate (toDate, fromDate) {
    toDate = this.clientToSqlDateFormat(toDate, this.clientDateFormat)
    fromDate = this.clientToSqlDateFormat(fromDate, this.clientDateFormat)
    if (new Date(toDate).getTime() < new Date(fromDate).getTime()) {
      return false
    } else {
      return true
    }
  }
}
