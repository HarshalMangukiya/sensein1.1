import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List and filter luxury products' })
  @ApiQuery({ name: 'category', required: false, description: 'Category name or all' })
  @ApiQuery({ name: 'collection', required: false, description: 'Curated collection' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, enum: ['featured', 'price-low', 'price-high', 'rating', 'discount'] })
  async findAll(
    @Query('category') category?: string,
    @Query('collection') collection?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minRating') minRating?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return this.productsService.findAll({
      category,
      collection,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      search,
      sort,
    });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get list of categories with product counts' })
  async getCategories() {
    return this.productsService.getCategories();
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get single product details by id or slug' })
  @ApiResponse({ status: 200, description: 'Product details' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.productsService.findOne(idOrSlug);
  }
}
