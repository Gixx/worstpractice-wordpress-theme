import { Logger } from '../Service/Logger';
import { Utility } from "../Service/Utility";
import { DialogWindowElement } from './Elements/DialogWindowElement';
import type { IComponent } from './Icomponent';
import type { IComponentElement } from './Elements/IComponentElement';

export class DialogWindow implements IComponent<HTMLDialogElement>
{
    private readonly logger: Logger;
    private readonly utility: Utility
    private readonly elements: IComponentElement<HTMLDialogElement>[];
    private idCounter: number = 1;

    constructor(utilityInstance: Utility, loggerInstance: Logger)
    {
        this.utility = utilityInstance;
        this.logger = loggerInstance;
        this.elements = [];
        this.init();
    }

    private init(): void
    {
        this.logger.componentLoaded();
        this.logger.seekComponentElements();

        const dialogHTMLElements = document.querySelectorAll('dialog.DialogWindow');

        if (dialogHTMLElements.length === 0) {
            this.logger.componentElementsNotFound();
            return;
        }

        const elementLogTitle = this.logger.componentName + ' Element';
        const elementLogColor = this.utility.endarkenColor(this.logger.colorId);

        dialogHTMLElements.forEach((node): void => {
            if (!(node instanceof HTMLDialogElement)) {
                return;
            }

            if (!node.hasAttribute('id')) {
                node.setAttribute('id', `DialogWindow-${this.idCounter++}`);
            }

            this.elements.push(
                new DialogWindowElement(
                    node,
                    new Logger(elementLogTitle, elementLogColor),
                    this.utility,
                )
            );
        });

        this.utility.triggerEvent(document, 'Component.DialogWindow.Ready', null,  1);
    }

    public getElements(): IComponentElement<HTMLDialogElement>[]
    {
        return this.elements;
    }

    public getDialogByName(name: string): DialogWindowElement<HTMLDialogElement> | null
    {
        for (const element of this.elements) {
            if (element.getName() === name) {
                return element as DialogWindowElement<HTMLDialogElement>;
            }
        }
        return null;
    }
}