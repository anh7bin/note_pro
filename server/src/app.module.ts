import { Module } from '@nestjs/common';
import { HasuraModule } from './hasura/hasura.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [AuthModule, UserModule, WorkspaceModule, HasuraModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
