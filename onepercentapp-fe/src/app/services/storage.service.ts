import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppSkelStorage, StorageKey } from '../core/interfaces/storage';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

/**
 * Storage Service
 *
 * Wrapper for Storage
 *
 * https://github.com/ionic-team/ionic-storage
 *
 */
@Injectable({
  providedIn: 'root',
  // eslint-disable-next-line indent
})
export class StorageService {
  /**
   * Not clear this keys when logout
   */
  private readonly lockedKeys: StorageKey[] = [
    StorageKey.language,
    StorageKey.userData,
    StorageKey.termsAccepted,

  ];

  /**
   * Keys saved in storage
   */
  private readonly keys: StorageKey[] = [
    StorageKey.accessToken,
    StorageKey.language,
    StorageKey.userData,
    StorageKey.userAcceptsBiometry,
  ];

  /**
   * Default values
   */
  private readonly defaultValues: AppSkelStorage = {
    [StorageKey.accessToken]: '',
    [StorageKey.refreshToken]: '',
    [StorageKey.language]: '',
    [StorageKey.userData]: null,
    [StorageKey.userAcceptsBiometry]: null,
    [StorageKey.analyticsConsent]: null,
    [StorageKey.termsAccepted]: null,
    [StorageKey.fcmToken]: '',
    [StorageKey.pushEnabled]: false,
    [StorageKey.googleAccessToken]: '',
    [StorageKey.metaAccessToken]: '',

  };

  /**
   * Get the saved keys
   */
  private readonly readSavedKeys: any = this.storage.keys.bind(this.storage);

  /**
   * Constructor
   *
   * @param storage
   */
  constructor(private readonly storage: Storage) {}

  /**
   * Check if first pair key exists, if not, it creates all pairs with default values
   */
  initStorageSettings(): Observable<void> {
    return from(this.storage.defineDriver(CordovaSQLiteDriver)).pipe(
      switchMap(() => from(this.storage.create())),
      switchMap(() => this.getSavedKeys()),
      switchMap((savedKeys) => {
        const newKeys = this.keys.filter((key) => !savedKeys.includes(key));
        if (newKeys.length === 0) {
          return of(undefined);
        }
        return from(Promise.all(newKeys.map((key) => this.createRecord(key))));
      }),
      switchMap(() => {
        if (environment.logStorageOnStartup) {
          return this.log();
        }
        return of(undefined);
      }),
      catchError(this.handleError<void>('initStorageSettings'))
    );
  }

  /**
   * Create new record in storage
   *
   * @param key - The key to create
   */
  private createRecord(key: StorageKey): Promise<void> {
    return this.storage.set(key, this.defaultValues[key]);
  }

  /**
   * Get all saved keys
   */
  private getSavedKeys(): Observable<string[]> {
    return from(this.storage.keys()).pipe(
      catchError(this.handleError<string[]>('getSavedKeys', []))
    );
  }

  /**
   * Get the value associated with the given key
   *
   * @param key - The key to identify this value
   */
  get<T>(key: StorageKey): Observable<T> {
    return from(this.storage.get(key)).pipe(
      catchError(this.handleError<T>(`get key: ${key}`))
    );
  }

  /**
   * Set the value for the given key
   *
   * @param key - The key to identify this value
   * @param value - The value for this key
   */
  set<T>(key: StorageKey, value: T): Observable<void> {
    return from(this.storage.set(key, value)).pipe(
      catchError(this.handleError<void>(`set key: ${key}`))
    );
  }

  /**
   * Clear all data except 'FIRST_TIME'
   */
clearAll(): Observable<void> {
  return from(this.storage.clear()).pipe(
    map(() => undefined),
    catchError(this.handleError<void>('clearAll'))
  );
}

  /**
   * Clear only the unlocked keys
   */
  clearUnlockedKeys(): Observable<void> {
    return from(this.storage.keys()).pipe(
      switchMap((keys) => {
        const unlockedKeys = keys.filter(
          (key) => !this.lockedKeys.includes(key as StorageKey)
        );
        return from(
          Promise.all(unlockedKeys.map((key) => this.storage.remove(key)))
        ).pipe(map(() => undefined));
      }),
      catchError(this.handleError<void>('clearUnlockedKeys'))
    );
  }

  /**
   * Show the contents of the database in the console.
   * It only works with $ionic serve because the devices use sqlite
   *
   * @param key - (Optional) The key to identify the value to be painted
   */
  log(key?: StorageKey): Observable<void> {
    if (key) {
      return this.get(key).pipe(
        map((value) => this.print(value, key)),
        catchError(this.handleError<void>(`log key: ${key}`))
      );
    }

    console.log(
      'StorageService: keys--------------------------------------------'
    );
    return from(this.storage.forEach(this.print)).pipe(
      map(() => {
        console.log(
          'StorageService: --------------------------------------------'
        );
      }),
      catchError(this.handleError<void>('log'))
    );
  }

  /**
   * Print log
   *
   * @param value - The value to print
   * @param key - The key to print
   * @param iterationNumber - (Optional) Iteration number
   */
  private print(value: any, key: string): void {
    console.log(
      `\tStorageService: ${key} \t\t ${JSON.stringify(value, undefined, 2)}`
    );
  }

  /**
   * Handle errors
   *
   * @param operation - The name of the operation that failed
   * @param result - (Optional) Default value to return
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
