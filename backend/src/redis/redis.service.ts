import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private inMemoryStore = new Map<string, { value: string; expiry: number }>();
  private useInMemory = true;

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      this.client = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        retryStrategy: () => null, // don't retry endlessly if redis is not running
      });

      this.client.on('error', (err) => {
        if (!this.useInMemory) {
          this.logger.warn(`Redis disconnected, falling back to in-memory store: ${err.message}`);
          this.useInMemory = true;
        }
      });

      await this.client.connect();
      this.useInMemory = false;
      this.logger.log('Connected to Redis successfully');
    } catch (err) {
      this.useInMemory = true;
      this.logger.warn('Redis unavailable at startup, using high-performance in-memory cache with TTL');
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.useInMemory && this.client) {
      try {
        if (ttlSeconds) {
          await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch (err) {
        this.useInMemory = true;
      }
    }

    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : Infinity;
    this.inMemoryStore.set(key, { value, expiry });
  }

  async get(key: string): Promise<string | null> {
    if (!this.useInMemory && this.client) {
      try {
        return await this.client.get(key);
      } catch (err) {
        this.useInMemory = true;
      }
    }

    const item = this.inMemoryStore.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.inMemoryStore.delete(key);
      return null;
    }

    return item.value;
  }

  async del(key: string): Promise<void> {
    if (!this.useInMemory && this.client) {
      try {
        await this.client.del(key);
        return;
      } catch (err) {
        this.useInMemory = true;
      }
    }

    this.inMemoryStore.delete(key);
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }
}
