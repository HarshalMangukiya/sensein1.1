import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchema } from './banner.schema';
import { Showcase, ShowcaseSchema } from './showcase.schema';
import { BeforeAfter, BeforeAfterSchema } from './before-after.schema';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banner.name, schema: BannerSchema },
      { name: Showcase.name, schema: ShowcaseSchema },
      { name: BeforeAfter.name, schema: BeforeAfterSchema },
    ]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
