
import { ErrorHandler } from '@angular/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash'

@Injectable()

export class GlobalErrorHandler  implements ErrorHandler  {
  handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
     if (chunkFailedMessage.test(error.message)) {
       window.location.reload();
     }
   }
 
 
}