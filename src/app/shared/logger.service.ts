import { Injectable } from '@angular/core';

// import { environment } from '@environments/environment';

/**
 * Class of static methods to allow for consistent console logging.
 * @export
 */
@Injectable({
  providedIn: 'root'
})
export class Logger {

  /**
   * Logs a consistent debug message format to the console.
   * @param [message] Optional message to log. Accepts objects too. Avoid circular json object references!
   * @param [devOnly] Only logs in development if true.
   */
  public static debug(module: string, method: string, message?: any, isDebugMode?:boolean, devOnly?: boolean) {
    // tslint:disable-next-line
    if (!isDebugMode) return;

      console.debug(`DEBUG :-) ${this.getMessage(module, method, message, devOnly)}`);
      if (typeof message == 'object') console.debug(message);
  }

  /**
   * Logs a consistent info message format to the console.
   * @param [message] Optional message to log. Accepts objects too. Avoid circular json object references!
   * @param [devOnly] Only logs in development if true.
   */
  public static info(module: string, method: string, message?: any, isDebugMode?:boolean, devOnly?: boolean) {
    // tslint:disable-next-line
    // console.info(`INFO :-) ${this.getMessage(module, method, message, devOnly)}`);
    if (!isDebugMode) return;
    
    console.info(`INFO :-) ${this.getMessage(module, method, message, devOnly)}`);
    if (typeof message == 'object') console.info(message);
  }

  /**
   * Logs a consistent warning message format to the console.
   * @param [message] Optional message to log. Accepts objects too. Avoid circular json object references!
   * @param [devOnly] Only logs in development if true.
   */
  public static warn(module: string, method: string, message?: any, isDebugMode?:boolean, devOnly?: boolean) {
    if (!isDebugMode) return;

    console.warn(`WARN :-) ${this.getMessage(module, method, message, devOnly)}`);
    if (typeof message == 'object') console.warn(message);
  }

  /**
   * Logs a consistent error message format to the console.
   * @param [message] Optional message to log. Accepts objects too. Avoid circular json object references!
   * @param [devOnly] Only logs in development if true.
   */
  public static error(module: string, method: string, message?: any, isDebugMode?:boolean, devOnly?: boolean) {
    if (!isDebugMode) return;

    console.error(`ERROR :-) ${this.getMessage(module, method, message, devOnly)}`);
    if (typeof message == 'object') console.error(message);
  }

  /**
   * Logs a consistent log message format to the console in development only.
   * @param [message] Optional message to log. Accepts objects too. Avoid circular json object references!
   */
  public static devOnly(module: string, method: string, message?: any, isDebugMode?:boolean) {
    // if (!environment.production) {
    //   // tslint:disable-next-line
    if (!isDebugMode) return;

    console.log(`DEVONLY :-)  ${this.getMessage(module, method, message)}`);
    if (typeof message == 'object') console.log(message)
    // }
  }

  /**
   * Logs a consistent warning message to the console in development only.
   * @param [message] Optional message to log. Accepts objects too. Avoid circular json object references!
   */
  public static techDebt(module: string, method: string, message?: any, isDebugMode?:boolean) {
		// if (!environment.production) {
		// 	// tslint:disable-next-line
    if (!isDebugMode) return;

    console.warn(`TECHDEBT:-) ${this.getMessage(module, method, message, false)}`);
		// }
	}
  
  private static getMessage(module: string, method: string, message?: any, devOnly?: boolean, isDebugMode?:boolean) {
    const type = typeof message;
    // if ((devOnly && environment.production) || type === 'undefined' || (type === 'string' && message.length === 0)) {
      if ((devOnly) || type === 'undefined' || (type === 'string' && message.length === 0)) {
      return `${module}.${method}`;
    } else if (type === 'string' || type === 'number') {
      return `${module}.${method} - ${message}`;
    } else {
      return `${module}.${method} - ${JSON.stringify(message)}`;
    }
  }
}