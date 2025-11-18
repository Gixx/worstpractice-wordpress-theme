import { Utility } from '../Service/Utility';
import { Logger } from '../Service/Logger';
import type { IRepository } from './IRepository';

export class CookieStorage implements IRepository {
    private static readonly MAX_COOKIE_EXPIRATION_DAYS = 7;

    private readonly utility: Utility;
    private readonly logger: Logger;

    constructor(utilityInstance: Utility, loggerInstance: Logger) {
        this.utility = utilityInstance;
        this.logger = loggerInstance;
        this.logger.repositoryLoaded();
        this.initialize();
    }

    private initialize(): void {
        this.utility.triggerEvent(document, 'Repository.Cookie.Ready', null, 1);
    }

    private setCookie(cookieName: string, cookieValue: string, expirationDays: number, standardLog = true): void {
        const date = new Date();
        date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + date.toUTCString();

        if (standardLog) this.logger.actionTriggered('Setting Cookie', cookieValue);

        document.cookie = cookieName + '=' + cookieValue + ';' + expires + ';path=/;SameSite=Lax' + (location.protocol === 'https:' ? ';secure' : '');
    }

    private getCookie(cookieName: string): string {
        const name = cookieName + '=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');

        for (let i = 0, num = cookieArray.length; i < num; i++) {
            // Ensure we always operate on a string and remove leading whitespace
            let cookie = cookieArray[i] ?? '';
            cookie = cookie.trimStart();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length);
            }
        }

        return '';
    }

    private renewCookie(cookieName: string, expirationDays: number): void {
        const cookieValue = this.getCookie(cookieName);

        if (cookieValue !== '') {
            this.logger.actionTriggered('Renew Cookie', cookieName);
            this.setCookie(cookieName, cookieValue, expirationDays, false);
        }
    }

    private deleteCookie(cookieName: string): void {
        if (this.getCookie(cookieName) !== '') {
            this.logger.actionTriggered('Delete Cookie', cookieName);
            this.setCookie(cookieName, '', -1);
        }
    }

    // Public API implementing IRepository
    public set(key: string, value: string, session = false): void {
        const expirationDays = session ? 0 : CookieStorage.MAX_COOKIE_EXPIRATION_DAYS;
        this.setCookie(key, value, expirationDays);
    }

    public get(key: string): string {
        return this.getCookie(key);
    }

    public renew(key: string, session = false): void {
        const expirationDays = session ? 0 : CookieStorage.MAX_COOKIE_EXPIRATION_DAYS;
        this.renewCookie(key, expirationDays);
    }

    public delete(key: string): void {
        this.deleteCookie(key);
    }
}
