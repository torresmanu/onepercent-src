import {
    Controller,
    Get,
    Logger,
    UseGuards,
    Request,
    Patch,
    Body,
    BadRequestException,
    UseInterceptors, UploadedFile, Post, Req, Delete, Param
} from '@nestjs/common';
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/role.guard";
import {ApiBody, ApiConsumes, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {User} from "../user/entities/user.entity";
import {ProfileService} from "./profile.service";
import {UpdateUserDto} from "../user/dto/updateUser.dto";
import {validate} from "class-validator";
import {UserService} from "../user/user.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {StorageService} from "../../common/storage/storage.service";
import {NominatimService} from "../../common/geolocation/nominatim.service";
import {SendContactFormEmailDto} from "./dto/sendContactFormEmail.dto";
import {MailService} from "../../common/mail/mail.service";

@Controller('profile')
export class ProfileController {
    private readonly logger = new Logger(ProfileController.name);

    constructor(
        private profileService: ProfileService,
        private userService: UserService,
        private storageService: StorageService,
    ) {
    }
    @Get()
    @ApiOperation({ summary: 'Get user profile' })
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })

    async get(@Request() req: any): Promise<User> {
        return this.profileService.findMe(req.user.id);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update profile by id' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'User profile updated successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })

    async update(@Body() userData: Partial<User>, @Request() req: any): Promise<User> {
        // DTO Validation
        const updateUserDto = Object.assign(new UpdateUserDto(), userData);
        const errors = await validate(updateUserDto);
        if (errors.length > 0) { throw new BadRequestException(errors.map((error: any) => error.constraints)); }
        // User id validation
        const user = await this.profileService.findMe(req.user.id);

        return this.userService.update(user.id, userData);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Update profile image' })
    @ApiResponse({ status: 200, description: 'Profile image updated successfully.' })
    @ApiResponse({ status: 400, description: 'No file uploaded or invalid file format.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })
    @ApiResponse({ status: 200, description: 'User profile deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })

    async delete(@Request() req: any): Promise<void> {
        return this.userService.delete(req.user.id);
    }

    @Post('updateProfileImage')
    @UseInterceptors(
        FileInterceptor('imageProfile', {
        // limits: { fileSize: 5 * 1024 * 1024 }, // Límite de tamaño (5MB)
    })
    )
    @UseGuards(JwtAuthGuard)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Update profile image' })
    @ApiResponse({ status: 200, description: 'Profile image updated successfully.' })
    @ApiResponse({ status: 400, description: 'No file uploaded or invalid file format.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })

    async updateProfileImage(@UploadedFile() imageProfile: Express.Multer.File, @Request() req: any): Promise<User> {
        // this.logger.debug(imageProfile);
        if (!imageProfile) {
            throw new BadRequestException('No file uploaded');
        }

        // User id validation
        const user = await this.profileService.findMe(req.user.id);

        // Save the image
        const filename = await this.storageService.saveUserProfile(imageProfile, user.id);

        // Update user profile with the image path
        const userData: Partial<User> = { imageProfile: filename };
        return this.userService.update(user.id, userData);
    }

    @Post('updateProfileLocation')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update profile location' })
    @ApiResponse({ status: 200, description: 'Profile location updated successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })

    async updateProfileLocation(@Request() req: any): Promise<User> {
        // Update user profile location
        return await this.profileService.updateProfileLocation(req.user.id, req.user.address, req.user.location, req.user.province, req.user.cp, req.user.country);
    }

    @Post('sendContactFormEmail')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update profile location' })
    @ApiBody({ type: SendContactFormEmailDto })
    @ApiResponse({ status: 200, description: 'Contact form email sent successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })
    @UseGuards(JwtAuthGuard)

    async sendContactFormEmail(@Body() messageDTO: SendContactFormEmailDto, @Request() req: any): Promise<void> {
        // Send email to contact and ACK to user
        await this.profileService.sendContactFormEmail(messageDTO.message, req.user.id);
    }


}
