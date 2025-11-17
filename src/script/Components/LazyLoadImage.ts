import { Logger } from '../Service/Logger';
import {Utility} from "../Service/Utility";
import { LazyLoadImageElement } from './Elements/LazyLoadImageElement';
import type { IComponent } from './Icomponent';
import type { IComponentElement } from './Elements/IComponentElement';
import {DialogWindowElement} from "./Elements/DialogWindowElement";

export class LazyLoadImage implements IComponent<HTMLImageElement>
{
    private readonly logger: Logger;
    private readonly utility: Utility;
    private readonly elements: IComponentElement<HTMLImageElement>[];
    private idCounter: number = 1;

    constructor(utilityInstance: Utility, loggerInstance: Logger) {
        this.utility = utilityInstance;
        this.logger = loggerInstance;
        this.elements = [];
        this.init();
    }

    private init(): void {
        this.logger.componentLoaded();
        this.logger.seekComponentElements();

        const lazyLoadImages = document.querySelectorAll('img[data-src]');

        if (lazyLoadImages.length ===0) {
            this.logger.componentElementsNotFound();
            return;
        }

        const imageObserver = new IntersectionObserver((entries, imgObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const lazyLoadImageElement = this.getLazyLoadImageById(entry.target.id);
                    if (lazyLoadImageElement) {
                        lazyLoadImageElement.loadImage();
                    }
                }
            })
        });

        const elementLogTitle = this.logger.componentName + ' Element';
        const elementLogColor = this.utility.endarkenColor(this.logger.colorId);

        lazyLoadImages.forEach((node): void => {
            if (!(node instanceof HTMLImageElement)) {
                return;
            }

            if (!node.hasAttribute('id')) {
                node.setAttribute('id', `LazyLoadImage-${this.idCounter++}`);
            }

            this.elements.push(
                new LazyLoadImageElement(
                    node,
                    new Logger(elementLogTitle, elementLogColor),
                )
            );
            imageObserver.observe(node);
        });

        this.utility.triggerEvent(document, 'Component.LazyLoadImage.Ready', null,  1);
    }

    public getElements(): IComponentElement<HTMLImageElement>[] {
        return this.elements;
    }

    public getLazyLoadImageById(elementId: string): LazyLoadImageElement<HTMLImageElement> | null {
        for (const element of this.elements) {
            if (element.getId() === elementId) {
                return element as LazyLoadImageElement<HTMLImageElement>;
            }
        }

        return null;
    }
}