import type { IComponentElement } from './IComponentElement';
import { Logger } from '../../Service/Logger';

export class LazyLoadImageElement<T extends HTMLImageElement> implements IComponentElement<T>
{
    private readonly element: T;
    private readonly logger: Logger;

    public constructor(element: T, loggerInstance: Logger)
    {
        this.element = element;
        this.logger = new Logger('Lazy Load Image Element', 'SkyBlue');
        this.logger.componentElementInitSuccess(this.element.id);
    }

    public getId(): string
    {
        return this.element.id;
    }

    public getName(): string
    {
        return this.element.id;
    }

    public getHTMLElement(): T
    {
        return this.element;
    }

    public async loadImage(): Promise<void>
    {
        if (!this.element.hasAttribute('data-src')) {
            return;
        }

        const imageSource: string | undefined = this.element.dataset?.src;
        if (typeof imageSource !== 'string' || imageSource.trim() === '') {
            this.logger.actionFailed('Invalid image source', String(imageSource));
            return;
        }

        try {
            await this.preloadImage(imageSource);
            this.element.src = imageSource;
            this.element.loading = 'lazy';
            this.element.removeAttribute('data-src');
            this.logger.actionSuccess('A Lazy Load Image element loaded', this.element.id);
        } catch {
            this.logger.actionFailed('An image resource is not found', imageSource);
        }
    }

    private preloadImage(src: string): Promise<void>
    {
        return new Promise<void>((resolve, reject) => {
            const preload = new Image();

            preload.addEventListener('load', () => resolve(), { once: true });
            preload.addEventListener('error', (event: Event) => reject(event), { once: true });

            preload.src = src;
        });
    }
}