import { Logger } from '../Service/Logger';
import { Utility } from "../Service/Utility";
import { CollapsibleElement } from './Elements/CollapsibleElement';
import type { IComponent } from './Icomponent';
import type { IComponentElement } from './Elements/IComponentElement';

export class Collapsible implements IComponent<HTMLButtonElement>
{
    private readonly logger: Logger;
    private readonly utility: Utility
    private readonly elements: IComponentElement<HTMLButtonElement>[];
    private idCounter: number = 1;

    constructor(utilityInstance: Utility, loggerInstance: Logger)
    {
        this.utility = utilityInstance;
        this.logger = loggerInstance;
        this.elements = [];
        this.init()
    }

    private init(): void
    {
        this.logger.componentLoaded();
        this.logger.seekComponentElements();

        const collapsibleButtons = document.querySelectorAll('.Collapsible button');

        if (collapsibleButtons.length ===0) {
            this.logger.componentElementsNotFound();
            return;
        }

        const elementLogTitle = this.logger.componentName + ' Element';
        const elementLogColor = this.utility.endarkenColor(this.logger.colorId);

        collapsibleButtons.forEach((node): void => {
            if (!(node instanceof HTMLButtonElement)) {
                return;
            }

            if (!node.hasAttribute('id')) {
                node.setAttribute('id', `Collapsible-${this.idCounter++}`);
            }

            this.elements.push(
                new CollapsibleElement(
                    node,
                    new Logger(elementLogTitle, elementLogColor),
                )
            );
        });
    }

    public getElements(): IComponentElement<HTMLButtonElement>[]
    {
        return this.elements;
    }
}