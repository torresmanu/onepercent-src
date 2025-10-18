import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post, Req, UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/role.guard";
import {ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";
import {Roles} from "../../common/decorators/role.decorator";
import {validate} from "class-validator";
import {CapsuleService} from "./capsule.service";
import {Capsule} from "./entities/capsule.entity";
import {CreateCapsuleDto} from "./dto/createCapsule.dto";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";

@Controller('capsule')
export class CapsuleController {
  constructor(private readonly capsuleService: CapsuleService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Find all Capsule' })
  @ApiResponse({ status: 200, description: 'List of all capsules retrieved successfully.' })

  async findAll(): Promise<Capsule[]> {
    return this.capsuleService.findAll();
  }

  @Get('findById/:capsuleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get Capsule by Id' })
  @ApiParam({ name: 'capsuleId', type: Number, description: 'ID of the capsule' })
  @ApiResponse({ status: 200, description: 'Capsule retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Capsule not found.' })

  async findById(@Param('capsuleId') capsuleId: number): Promise<Capsule> {
    return this.capsuleService.findById(capsuleId);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      // limits: { fileSize: 5 * 1024 * 1024 }, // Límite de tamaño (5MB)
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(png|jpg|jpeg)$/)) {
          return cb(
            new BadRequestException(
              'Solo se permiten imágenes en formato PNG, JPG y JPEG',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @Roles('admin')
  @ApiOperation({ summary: 'Create Capsule' })
  @ApiBody({ type: CreateCapsuleDto })
  @ApiResponse({ status: 201, description: 'Capsule created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation errors.' })

  async create(
    @Body() capsuleData: Partial<Capsule>,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Capsule> {
    // DTO Validation
    const createCapsuleDto = Object.assign(new CreateCapsuleDto(), capsuleData);
    const errors = await validate(createCapsuleDto);
    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((error: any) => error.constraints),
      );
    }

    return this.capsuleService.createWithThumbnail(
      capsuleData,
      image,
    );
  }

  @Patch()
  @UseInterceptors(
      FileInterceptor('image', {
        // limits: { fileSize: 5 * 1024 * 1024 }, // Límite de tamaño (5MB)
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/^image\/(png|jpg|jpeg)$/)) {
            return cb(
                new BadRequestException(
                    'Solo se permiten imágenes en formato PNG, JPG y JPEG',
                ),
                false,
            );
          }
          cb(null, true);
        },
      }),
  )
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @Roles('admin')
  @ApiOperation({ summary: 'Update Capsule by id' })
  @ApiBody({ type: CreateCapsuleDto })
  @ApiResponse({ status: 200, description: 'Capsule updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation errors or missing ID.' })
  @ApiResponse({ status: 404, description: 'Capsule not found.' })

  async update(@Body() capsuleData: Partial<Capsule>, @UploadedFile() image: Express.Multer.File,): Promise<Capsule> {
    // DTO Validation
    const updateCapsuleDto = Object.assign(new CreateCapsuleDto(), capsuleData);
    const errors = await validate(updateCapsuleDto);
    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((error: any) => error.constraints),
      );
    }
    if (!capsuleData.id) {
      throw new BadRequestException('Activity Type ID is required');
    }
    // Capsule id validation
    const capsule = await this.capsuleService.findById(capsuleData.id);

    return this.capsuleService.updateWithThumbnail(capsule.id, capsuleData, image);
  }

  @Delete(':capsuleId')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete Capsule' })
  @ApiParam({ name: 'capsuleId', type: Number, description: 'ID of the capsule to delete' })
  @ApiResponse({ status: 200, description: 'Capsule deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Capsule not found.' })

  async delete(@Param('capsuleId') capsuleId: number): Promise<void> {
    return this.capsuleService.delete(capsuleId);
  }
}
