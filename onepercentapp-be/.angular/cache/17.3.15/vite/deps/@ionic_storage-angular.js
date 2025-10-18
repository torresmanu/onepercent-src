import {
  Storage
} from "./chunk-VJZ6LVPU.js";
import {
  isPlatformServer
} from "./chunk-7OUUNGKT.js";
import {
  InjectionToken,
  NgModule,
  PLATFORM_ID,
  setClassMetadata,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-JOETMAW4.js";
import "./chunk-M2BWQ664.js";
import "./chunk-EM4E5IPL.js";
import "./chunk-XFSH6TDE.js";
import "./chunk-ZFE3LNNR.js";
import {
  __async
} from "./chunk-6CFBTS4D.js";

// node_modules/@ionic/storage-angular/fesm2020/ionic-storage-angular.mjs
var StorageConfigToken = new InjectionToken("STORAGE_CONFIG_TOKEN");
var NoopStorage = class extends Storage {
  constructor() {
    super();
  }
  create() {
    return __async(this, null, function* () {
      return this;
    });
  }
  defineDriver() {
    return __async(this, null, function* () {
    });
  }
  get driver() {
    return "noop";
  }
  get(key) {
    return __async(this, null, function* () {
      return null;
    });
  }
  set(key, value) {
    return __async(this, null, function* () {
    });
  }
  remove(key) {
    return __async(this, null, function* () {
    });
  }
  clear() {
    return __async(this, null, function* () {
    });
  }
  length() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  keys() {
    return __async(this, null, function* () {
      return [];
    });
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  forEach(iteratorCallback) {
    return __async(this, null, function* () {
    });
  }
  setEncryptionKey(key) {
  }
};
function provideStorage(platformId, storageConfig) {
  if (isPlatformServer(platformId)) {
    return new NoopStorage();
  }
  return new Storage(storageConfig);
}
var IonicStorageModule = class _IonicStorageModule {
  static forRoot(storageConfig = null) {
    return {
      ngModule: _IonicStorageModule,
      providers: [{
        provide: StorageConfigToken,
        useValue: storageConfig
      }, {
        provide: Storage,
        useFactory: provideStorage,
        deps: [PLATFORM_ID, StorageConfigToken]
      }]
    };
  }
};
IonicStorageModule.ɵfac = function IonicStorageModule_Factory(t) {
  return new (t || IonicStorageModule)();
};
IonicStorageModule.ɵmod = ɵɵdefineNgModule({
  type: IonicStorageModule
});
IonicStorageModule.ɵinj = ɵɵdefineInjector({});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IonicStorageModule, [{
    type: NgModule
  }], null, null);
})();
export {
  IonicStorageModule,
  Storage,
  StorageConfigToken,
  provideStorage
};
//# sourceMappingURL=@ionic_storage-angular.js.map
