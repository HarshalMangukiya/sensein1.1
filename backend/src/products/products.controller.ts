import { Controller, Get, Post, Patch, Delete, Param, Query, Body, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller(['products', 'api/products'])
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  @ApiOperation({ summary: 'List and filter luxury products from MongoDB Atlas' })
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
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  @ApiOperation({ summary: 'Get list of categories with product counts from MongoDB Atlas' })
  async getCategories() {
    return this.productsService.getCategories();
  }

  @Get(':idOrSlug')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  @ApiOperation({ summary: 'Get single product details by id or slug from MongoDB Atlas' })
  @ApiResponse({ status: 200, description: 'Product details' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.productsService.findOne(idOrSlug);
  }

  @Post()
  @ApiOperation({ summary: 'Create new product in MongoDB Atlas (Admin)' })
  async create(@Body() dto: any): Promise<any> {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product in MongoDB Atlas (Admin)' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.productsService.update(id, dto);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Adjust product stock in MongoDB Atlas (Admin)' })
  async updateStock(@Param('id') id: string, @Body('delta') delta: number) {
    return this.productsService.updateStock(id, delta);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product from MongoDB Atlas (Admin)' })
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
