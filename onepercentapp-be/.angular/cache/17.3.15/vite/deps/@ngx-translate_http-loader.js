import {
  HttpClient
} from "./chunk-FHCQ2WKM.js";
import "./chunk-7OUUNGKT.js";
import {
  Inject,
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-JOETMAW4.js";
import "./chunk-M2BWQ664.js";
import "./chunk-EM4E5IPL.js";
import "./chunk-XFSH6TDE.js";
import "./chunk-ZFE3LNNR.js";
import {
  __publicField
} from "./chunk-6CFBTS4D.js";

// node_modules/@ngx-translate/http-loader/fesm2022/ngx-translate-http-loader.mjs
var _TranslateHttpLoader = class _TranslateHttpLoader {
  constructor(http, prefix = "/assets/i18n/", suffix = ".json") {
    __publicField(this, "http");
    __publicField(this, "prefix");
    __publicField(this, "suffix");
    this.http = http;
    this.prefix = prefix;
    this.suffix = suffix;
  }
  /**
   * Gets the translations from the server
   */
  getTranslation(lang) {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
};
__publicField(_TranslateHttpLoader, "ɵfac", function TranslateHttpLoader_Factory(t) {
  return new (t || _TranslateHttpLoader)(ɵɵinject(HttpClient), ɵɵinject(String), ɵɵinject(String));
});
__publicField(_TranslateHttpLoader, "ɵprov", ɵɵdefineInjectable({
  token: _TranslateHttpLoader,
  factory: _TranslateHttpLoader.ɵfac
}));
var TranslateHttpLoader = _TranslateHttpLoader;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateHttpLoader, [{
    type: Injectable
  }], () => [{
    type: HttpClient
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [String]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [String]
    }]
  }], null);
})();
export {
  TranslateHttpLoader
};
//# sourceMappingURL=@ngx-translate_http-loader.js.map
