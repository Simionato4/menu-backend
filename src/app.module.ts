import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './cases/categories/category.module';
import { SpotModule } from './cases/spots/spot.module';
import { ProductModule } from './cases/products/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseURL = configService.get<string>('DATABASE_URL');
        const dbschema = configService.get<string>('DATABASE_SCHEMA', 'public');

        if (!databaseURL) {
          throw new Error('DATABASE_URL is not defined in the environment variables');
        }

        return {
          type: 'postgres',
          url: databaseURL,
          schema: dbschema,
          autoLoadEntities: true,
          synchronize: true,
          ssl: false
        };
      },
    }),
    CategoryModule,
    ProductModule,
    SpotModule,
  ],
})
export class AppModule {}
