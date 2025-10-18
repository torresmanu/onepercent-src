"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TokenInterceptor = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var auth_service_1 = require("src/app/services/auth/auth.service");
var storage_service_1 = require("src/app/services/storage.service");
var storage_1 = require("src/app/core/interfaces/storage");
var TokenInterceptor = /** @class */ (function () {
    function TokenInterceptor() {
        this.authService = core_1.inject(auth_service_1.AuthService);
        this.storageService = core_1.inject(storage_service_1.StorageService);
    }
    TokenInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        console.log('[TokenInterceptor] Intercepting request:', request.url);
        // Solo interceptar rutas privadas (que empiecen por /private o /api/private, ajusta según tu backend)
        var isPrivate = window.location.pathname.includes('/private/');
        console.log('refresh', isPrivate);
        if (!isPrivate) {
            console.log('[TokenInterceptor] Ignorando ruta pública:', window.location.pathname);
            return next.handle(request);
        }
        return this.storageService.get(storage_1.StorageKey.accessToken).pipe(operators_1.switchMap(function (token) {
            var req = request;
            if (token) {
                console.log('[TokenInterceptor] Token found, adding Authorization header');
                req = request.clone({
                    setHeaders: { Authorization: "Bearer " + token }
                });
            }
            else {
                console.log('[TokenInterceptor] No token found');
            }
            return next.handle(req).pipe(operators_1.catchError(function (error) {
                var _a;
                if (error.status === 401 &&
                    ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) !== 'Contraseña antigua incorrecta') {
                    console.warn('[TokenInterceptor] 401 error detected, attempting to refresh token');
                    // Intentar refrescar el token
                    return _this.authService.refreshToken().pipe(operators_1.switchMap(function (newToken) {
                        console.log('[TokenInterceptor] Token refreshed, retrying request');
                        var retryReq = request.clone({
                            setHeaders: { Authorization: "Bearer " + newToken }
                        });
                        return next.handle(retryReq);
                    }), operators_1.catchError(function (err) {
                        console.error('[TokenInterceptor] Token refresh failed', err);
                        // Si falla el refresh, propaga el error
                        return rxjs_1.throwError(function () { return err; });
                    }));
                }
                console.error('[TokenInterceptor] Request failed', error);
                return rxjs_1.throwError(function () { return error; });
            }));
        }));
    };
    TokenInterceptor = __decorate([
        core_1.Injectable()
    ], TokenInterceptor);
    return TokenInterceptor;
}());
exports.TokenInterceptor = TokenInterceptor;
