import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { NodemailerService } from '../../services/nodemailer/nodemailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, SupabaseAuthGuard, NodemailerService],
  exports: [UserService],
})

export class UserModule { }
