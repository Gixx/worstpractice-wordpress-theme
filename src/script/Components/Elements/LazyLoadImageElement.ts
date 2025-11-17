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

    public loadImage(): void
    {
        if (!this.element.hasAttribute('data-src')) {
            this.logger.actionFailed('The element must have "data-src" attribute.');
            return;
        }

        const imageSource: string = this.element.dataset.src || '';

        if (imageSource.trim() === '') {
            this.logger.actionFailed('Invalid image source', String(imageSource));
            return;
        }

        this.preloadImage(imageSource).then((): void => {
            this.element.src = imageSource;
            this.element.loading = 'lazy';
            this.element.removeAttribute('data-src');
            this.logger.actionSuccess('A Lazy Load Image element loaded', this.element.id);
        }).catch((event: Event): void => {
            this.logger.actionFailed('An image resource is not found', event);
        });
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