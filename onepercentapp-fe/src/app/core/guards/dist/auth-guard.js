"use strict";
exports.__esModule = true;
exports.authGuard = void 0;
var core_1 = require("@angular/core");
var storage_service_1 = require("src/app/services/storage.service");
var storage_1 = require("../interfaces/storage");
var auth_service_1 = require("src/app/services/auth/auth.service");
var rxjs_1 = require("rxjs");
var standalone_1 = require("@ionic/angular/standalone");
exports.authGuard = function (route, state) {
    var navCtrl = core_1.inject(standalone_1.NavController);
    var storageService = core_1.inject(storage_service_1.StorageService);
    var authService = core_1.inject(auth_service_1.AuthService);
    return storageService.get(storage_1.StorageKey.accessToken).pipe(rxjs_1.switchMap(function (accessToken) {
        if (accessToken) {
            // Verifica si el token es válido
            return authService.checkTokenValidity().pipe(rxjs_1.map(function (isValidToken) {
                if (isValidToken) {
                    // Si el token es válido y está intentando acceder a una ruta pública, redirige a las rutas privadas
                    if (state.url.includes('public')) {
                        navCtrl.navigateForward('/private');
                        return false;
                    }
                    return true; // Permite el acceso a rutas privadas
                }
                // Si el token no es válido, redirige al login
                navCtrl.navigateForward('/public/login');
                return false;
            }), rxjs_1.catchError(function (error) {
                console.error('Error al verificar el token:', error);
                navCtrl.navigateForward('/public/login');
                return rxjs_1.of(false);
            }));
        }
        // Si no hay token, redirige al login si intenta acceder a rutas privadas
        if (state.url.includes('private')) {
            navCtrl.navigateForward('/public/login');
            return rxjs_1.of(false);
        }
        // Permite el acceso a rutas públicas si no hay token
        return rxjs_1.of(true);
    }), rxjs_1.catchError(function (error) {
        console.error('Error al obtener el token del almacenamiento:', error);
        navCtrl.navigateForward('/public/login');
        return rxjs_1.of(false);
    }));
};
