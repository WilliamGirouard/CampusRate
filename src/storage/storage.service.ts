import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname } from 'node:path';
import { StorageContract } from './interface/storage-contract.js';



@Injectable()
export class StorageService implements OnModuleInit {
    private readonly dataFilePath: string;

    constructor(private readonly configService: ConfigService) {
        this.dataFilePath = this.configService.get<string>("DATA_FILE_PATH")!;
    }

    //If exists then nothing else then creates folders and file from dataFilePath
    async onModuleInit(): Promise<void> {
        try {
            await access(this.dataFilePath);
        } catch {
            await mkdir(dirname(this.dataFilePath), { recursive: true });
            const baseData: StorageContract = { places: [], reviews: [] };
            await writeFile(this.dataFilePath, JSON.stringify(baseData, null, 2), "utf-8");
        }
    }
    // Why using JSON when there are Databases nowadays :( Basic file reading
    async readJSONFile(): Promise<StorageContract> {
        try {
            const rawData = (await readFile(this.dataFilePath, "utf-8"));
            return JSON.parse(rawData) as StorageContract;
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error("Parsing failed, file is corrupted ??? oops", error);
                throw new InternalServerErrorException("Data is corrupted in the file, cannot read it ");
            }
            throw error;
        }
    }
    // Basic file writing in the correct path of course hehe
    async writeJSONFile(data: StorageContract): Promise<void> {
        await writeFile(this.dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    }
}
