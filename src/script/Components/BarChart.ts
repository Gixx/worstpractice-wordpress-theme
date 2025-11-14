import { Logger } from '../Service/Logger';
import {Utility} from "../Service/Utility";
import { BarChartElement } from './Elements/BarChartElement';
import type { IComponent } from './Icomponent';
import type { IComponentElement } from './Elements/IComponentElement';

export class BarChart implements IComponent<HTMLDivElement> {
    private readonly logger: Logger;
    private readonly utility: Utility;
    private readonly chartStyles: Record<string, Record<string, string>>;
    private readonly elements: IComponentElement<HTMLDivElement>[];
    private idCounter: number = 1;

    constructor(utilityInstance: Utility, loggerInstance: Logger) {
        this.utility = utilityInstance;
        this.logger = loggerInstance;
        this.chartStyles = this.utility.readStylesheetsByClassName('BarChart');
        this.elements = [];
        this.init()
    }

    private init(): void {
        this.logger.componentLoaded();
        this.logger.seekComponentElements();

        const chartWrappers = document.querySelectorAll('.BarChart .grid');
        if (chartWrappers.length ===0) {
            this.logger.componentElementsNotFound();
            return;

        }
        const elementLogTitle = this.logger.componentName + ' Element';
        const elementLogColor = this.utility.endarkenColor(this.logger.colorId);

        chartWrappers.forEach((node): void => {
            if (!(node instanceof HTMLDivElement)) {
                return;
            }

            if (!node.hasAttribute('id')) {
                node.setAttribute('id', `BarChart-${this.idCounter++}`);
            }

            this.elements.push(
                new BarChartElement(
                    node,
                    this.chartStyles,
                    new Logger(elementLogTitle, elementLogColor),
                )
            );
        });

        this.utility.triggerEvent(document, 'Component.BarChart.Ready', null,  1);
    }

    public getElements(): IComponentElement<HTMLDivElement>[] {
        return this.elements;
    }
}