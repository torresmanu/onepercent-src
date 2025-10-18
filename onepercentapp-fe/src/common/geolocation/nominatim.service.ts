import {Injectable, Logger} from "@nestjs/common";
import {RestService} from "../net/rest.service";

@Injectable()
export class NominatimService {
    apiUrl = process.env.NOMINATINM_API_URL || 'https://nominatim.openstreetmap.org';
    headers = {};
    private readonly logger = new Logger(NominatimService.name);

    constructor(
        private restService: RestService
    ) {
        this.restService.setApiUrl(this.apiUrl);
        this.restService.setHeaders(this.headers);
    }

    async sendQuery(query: string) {
        return new Promise((resolve, reject) => {
            this.logger.debug("GEO:Searching for = " + encodeURIComponent(query));
            this.restService.get('/search?q=' + encodeURIComponent(query) + '&format=json&polygon_kml=1&addressdetails=1', {}).subscribe({
                next: (resp: any) => {
                    resolve(resp);
                },
                error: (error: any) => {
                    this.logger.error(`GEO: ${error.toString()}`)
                    reject(error);
                }
            });
        });
    }

    async sendFilteredQuery(city: string, country: string, street: string) {
        return new Promise((resolve, reject) => {
            this.restService.get('/search?country='
                + encodeURIComponent(country) + '&city=' + encodeURIComponent(city) + '&street=' + encodeURIComponent(street) + '&postalcode=' + '&format=json&polygon_kml=1&addressdetails=1'
                , {}).subscribe({
                    next: (resp: any) => {
                        resolve(resp);
                    },
                    error: (error: any) => {
                        reject(error);
                    }
                });
        });
    }

    async sendQueryByPostalCode(country: string, cp: string) {
        return new Promise((resolve, reject) => {
            this.restService.get('/search?country='
                + encodeURIComponent(country) + '&postalcode=' + encodeURIComponent(cp) + '&format=json&polygon_kml=1&addressdetails=1'
                , {}).subscribe({
                next: (resp: any) => {
                    resolve(resp);
                },
                error: (error: any) => {
                    reject(error);
                }
            });
        });
    }


}