import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { MyJwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';

// TODO add layer security on all request with admin

@Controller('apps')
@ApiTags('apps')
@UseGuards(MyJwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createAppDto: CreateAppDto) {
    return this.appsService.create(createAppDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.appsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.appsService.findOne(+id);
  }

  @Get('discover')
  @Roles(Role.ADMIN, Role.CLIENT)
  discover() {
    return this.appsService.discoverAll();
  }

  @Get('discover/:id')
  @Roles(Role.ADMIN, Role.CLIENT)
  discoverOne(@Param('id') id: string) {
    return this.appsService.discoverOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateAppDto: UpdateAppDto) {
    return this.appsService.update(+id, updateAppDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.appsService.remove(+id);
  }
}
