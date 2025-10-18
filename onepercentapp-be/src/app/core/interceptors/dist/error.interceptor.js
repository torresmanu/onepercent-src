"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ErrorInterceptor = exports.SHOW_MSG = void 0;
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var auth_service_1 = require("src/app/services/auth/auth.service");
var utils_service_1 = require("src/app/services/utils.service");
var storage_service_1 = require("src/app/services/storage.service");
var storage_1 = require("src/app/core/interfaces/storage");
var standalone_1 = require("@ionic/angular/standalone");
var toast_service_1 = require("src/app/services/toast.service");
var URL_EXCEPTIONS = ["/quadrant/add-quadrant"];
exports.SHOW_MSG = new http_1.HttpContextToken(function () { return true; });
var ErrorInterceptor = /** @class */ (function () {
    function ErrorInterceptor() {
        this.utilsService = core_1.inject(utils_service_1.UtilsService);
        this.toastService = core_1.inject(toast_service_1.ToastService);
        this.authService = core_1.inject(auth_service_1.AuthService);
        this.storageService = core_1.inject(storage_service_1.StorageService);
        this.navCtrl = core_1.inject(standalone_1.NavController);
    }
    ErrorInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        // Obtener el token desde StorageService
        return this.storageService.get(storage_1.StorageKey.accessToken).pipe(rxjs_1.switchMap(function (token) {
            if (token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: "Bearer " + token
                    }
                });
            }
            return next.handle(request).pipe(rxjs_1.catchError(function (error) {
                if (error instanceof http_1.HttpErrorResponse) {
                    var status = error.status;
                    var url = new URL(request.url);
                    // Manejo de errores 401
                    if (status === 401 && request.url.includes('token')) {
                        console.warn('Error 401: Unauthorized');
                        return _this.handle401Error();
                    }
                    // Excluir URLs específicas
                    if (!URL_EXCEPTIONS.includes(url.pathname) && request.context.get(exports.SHOW_MSG)) {
                        var message = _this.getMsg(status, error);
                        _this.toastService.presentToastDanger(message);
                    }
                    // Log detallado del error
                    console.error('HTTP Error Interceptor:', {
                        status: error.status,
                        message: error.message,
                        url: request.url,
                        error: error.error
                    });
                    return rxjs_1.throwError(function () { return error; });
                }
                return rxjs_1.throwError(function () { return error; });
            }));
        }));
    };
    /**
     * Manejar errores 401 (Unauthorized)
     */
    ErrorInterceptor.prototype.handle401Error = function () {
        var _this = this;
        return this.storageService.clearUnlockedKeys().pipe(rxjs_1.switchMap(function () {
            _this.navCtrl.navigateRoot('/public/login'); // Redirigir al login
            return rxjs_1.throwError(function () { return new Error('Unauthorized: Redirecting to login.'); });
        }));
    };
    /**
     * Generar mensaje de error basado en el código de estado HTTP
     *
     * @param status - Código de estado HTTP
     * @param error - Respuesta de error HTTP
     * @returns Mensaje de error
     */
    ErrorInterceptor.prototype.getMsg = function (status, error) {
        var _a, _b, _c;
        var data = {
            500: 'Error interno en el servidor',
            400: ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || error.message,
            404: 'Recurso no encontrado.',
            403: 'No tiene los permisos necesarios para realizar esta acción.',
            409: ((_b = error.error) === null || _b === void 0 ? void 0 : _b.message) || ((_c = error.error) === null || _c === void 0 ? void 0 : _c.detail),
            0: 'Servicio temporalmente no disponible, inténtelo más tarde'
        };
        return data[status] || error.message;
    };
    ErrorInterceptor = __decorate([
        core_1.Injectable()
    ], ErrorInterceptor);
    return ErrorInterceptor;
}());
exports.ErrorInterceptor = ErrorInterceptor;
