import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { UpdateResetPasswordDto } from './dto/update-reset-password.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {ResetPassword} from "./entities/reset-password.entity";
import {Repository} from "typeorm";
import {BaseService} from "../../common/services/base.service";

@Injectable()
export class ResetPasswordService extends BaseService<ResetPassword>{
  constructor(
      @InjectRepository(ResetPassword)
      private readonly resetPasswordRepository: Repository<ResetPassword>,
  ) {
    super(resetPasswordRepository);
  }

  async findByToken(token: string): Promise<ResetPassword> {
    const resetPassword = await this.resetPasswordRepository.findOne({ where: { token } });
    if (!resetPassword) {
      throw new NotFoundException('Token not found');
    }

    return resetPassword;
  }

  async create(createResetPasswordDto: CreateResetPasswordDto) {
    return this.resetPasswordRepository.save(createResetPasswordDto);
  }

}
