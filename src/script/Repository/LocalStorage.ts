import { Utility } from '../Service/Utility';
import { Logger } from '../Service/Logger';
import type { IRepository } from './IRepository';

export class LocalStorage implements IRepository {
    private readonly utility: Utility;
    private readonly logger: Logger;
    private readonly storage: Record<string, Storage> = {};

    constructor(utilityInstance: Utility, loggerInstance: Logger) {
        this.utility = utilityInstance;
        this.logger = loggerInstance;
        this.logger.repositoryLoaded();
        this.initialize();
    }

    private initialize(): void {
        this.initStorageKeys(localStorage);
        this.initStorageKeys(sessionStorage);

        this.utility.triggerEvent(document, 'Repository.LocalStorage.Ready', null, 1);
    }

    private initStorageKeys(storageEngine: Storage): void {
        const storageKeys = Object.keys(storageEngine as unknown as Record<string, unknown>);
        for (const key of storageKeys) {
            this.storage[key] = storageEngine;
        }
    }

    private setData(key: string, value: string, _session = false): void {
        const engine = this.storage[key];
        if (typeof engine !== 'undefined' && engine !== null) {
            engine.setItem(key, value);
        }
    }

    private getDataByKey(key: string): string {
        const engine = this.storage[key];
        if (typeof engine !== 'undefined' && engine !== null) {
            const val = engine.getItem(key);
            return val === null ? '' : val;
        }
        return '';
    }

    private deleteDataByKey(key: string): void {
        const engine = this.storage[key];
        if (typeof engine !== 'undefined' && engine !== null) {
            engine.removeItem(key);
        }
    }

    // Public API - implementing IRepository
    public set(key: string, value: string, session = false): void {
        // To avoid leaving keys pointing to the wrong engine, always delete first
        this.deleteDataByKey(key);
        this.storage[key] = session ? sessionStorage : localStorage;
        this.setData(key, value, session);
    }

    public get(key: string): string {
        return this.getDataByKey(key);
    }

    public renew(key: string, session = false): void {
        const value = this.getDataByKey(key);
        if (value !== '') {
            this.set(key, value, session);
        }
    }

    public delete(key: string): void {
        this.deleteDataByKey(key);
    }
}
