import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import dbConfig from './dbConfig';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    const uri = dbConfig()?.database?.url || '';
    const dbName = dbConfig()?.database?.name || '';

    return {
      uri: uri,
      dbName: dbName,
    }
  }
}