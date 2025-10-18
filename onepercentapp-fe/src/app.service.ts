import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return process.env.API_NAME + ' API. -*- Site access restricted. Please, get out of here! -*-';
  }
}
