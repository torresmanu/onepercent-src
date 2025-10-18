import { inject, Injectable } from '@angular/core';
import { StorageKey } from 'src/app/core/interfaces/storage';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, switchMap } from 'rxjs';
import { StorageService } from './storage.service';

/**
 * Locale interface
 */
export interface Locale {
  /**
   * Defines a string variable to manage the lang field
   */
  lang: string;

  /**
   * Defines an any variable to manage the data field
   */
  data: any;
}

/**
 * Translate Service
 */
@Injectable({
  providedIn: 'root',
  // eslint-disable-next-line indent
})
export class TranslationService {
  /**
   * Defines an any Array variable to manage the lang identifies
   */
  private readonly langIds: any = [];

  private readonly storageService = inject(StorageService);
  private readonly translate= inject(TranslateService);

  /**
   * Service Constructor
   *
   * @param storageService
   * @param translate
   */
  constructor() { }

  /**
   * Initialize
   */
  init(): void {
    // add new langIds to the list
    this.translate.addLangs(['es']);

    // The method below can be used to get the device's chosen language so that the app matches it.
    const browserLang: string | undefined = this.translate.getBrowserLang();

    // Set whichever language is preferred
    this.translate.use('es');

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('es');
    //moment.locale('es');
  }

  /**
   * Load Translation
   *
   * @param args: Locale[]
   */
  loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach(locale => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translate.setTranslation(locale.lang, locale.data, true);

      this.langIds.push(locale.lang);
    });

    // add new languages to the list
    this.translate.addLangs(this.langIds);
  }

  /**
   * Setup language
   *
   * @param lang: any
   */
  setLanguage(lang: string): Observable<void> {
    if (lang) {
      this.translate.use(lang); // Set the language for translations
      return this.storageService.set(StorageKey.language, lang); // Save the language in storage
    }
    return of(); // Return an empty observable if no language is provided
  }

  /**
   * Returns selected language
   */
  getSelectedLanguage(): Observable<string> {
    return this.storageService.get<string>(StorageKey.language).pipe(
      switchMap((lang) => {
        if (lang) {
          return of(lang); // Return the stored language if it exists
        }
        return of(this.translate.getDefaultLang()); // Otherwise, return the default language
      })
    );
  }
}
