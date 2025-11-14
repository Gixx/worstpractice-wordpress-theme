// filepath: src/script/Components/Elements/DialogWindowElement.ts
import type { IComponentElement } from './IComponentElement';
import { Logger } from '../../Service/Logger';
import { Utility } from '../../Service/Utility';

/**
 * DialogWindowElement class converted from legacy JS into TypeScript.
 */
export class DialogWindowElement<T extends HTMLDialogElement> implements IComponentElement<T>
{
    private readonly element: T;
    private readonly logger: Logger;
    private readonly utility: Utility;
    private readonly dialogName: string;
    private readonly isModal: boolean;

    private readonly okButton: HTMLButtonElement | null;
    private readonly saveButton: HTMLButtonElement | null;
    private readonly applyButton: HTMLButtonElement | null;
    private readonly deleteButton: HTMLButtonElement | null;
    private readonly cancelButton: HTMLButtonElement | null;
    private readonly closeButton: HTMLButtonElement | null;

    private readonly tabSwitchButtons: NodeListOf<HTMLButtonElement>;
    private readonly tabs: NodeListOf<HTMLElement>

    constructor(element: T, loggerInstance: Logger, utilityInstance: Utility)
    {
        this.element = element;
        this.logger = loggerInstance;
        this.utility = utilityInstance;
        this.dialogName = this.element.dataset?.name ?? this.element.id ?? '';
        this.isModal = this.element.dataset?.type === 'modal';

        this.okButton = this.element.querySelector<HTMLButtonElement>('.d-buttons__ok');
        this.saveButton = this.element.querySelector<HTMLButtonElement>('.d-buttons__save');
        this.applyButton = this.element.querySelector<HTMLButtonElement>('.d-buttons__apply');
        this.deleteButton = this.element.querySelector<HTMLButtonElement>('.d-buttons__delete');
        this.cancelButton = this.element.querySelector<HTMLButtonElement>('.d-buttons__cancel');
        this.closeButton = this.element.querySelector<HTMLButtonElement>('.d-buttons__close');

        this.tabSwitchButtons = this.element.querySelectorAll('.d-buttons__tab');
        this.tabs = this.element.querySelectorAll('.d-tab');

        this.bindEvents();

        this.logger.componentElementInitSuccess(this.element.id);
    }

    // Public API (IComponentElement)
    public getId(): string | number
    {
        return this.element.id;
    }

    public getName(): string
    {
        return this.dialogName;
    }

    public getHTMLElement(): T
    {
        return this.element;
    }

    // Open the dialog
    public open(): void
    {
        this.openDialog();
    }

    // Close the dialog
    public close(): void
    {
        this.closeDialog();
    }

    // --- Private helpers ---
    private openDialog(): void
    {
        // Display dialog
        if (this.isModal) {
            this.element.showModal();
        } else {
            this.element.show();
        }
        this.logger.actionTriggered(`"${this.element.id}" Dialog window is opened`, this.element.id);
    }

    private closeDialog(): void
    {
        this.element.close();
        this.logger.actionTriggered(`"${this.element.id}" Dialog window is closed`, this.element.id);
    }

    private showTab(tabName: string): void
    {
        this.tabs.forEach((tab) => {
            if (tab.dataset?.tab === tabName) {
                tab.classList.add('-active');
            } else {
                tab.classList.remove('-active');
            }
        });
    }

    private bindEvents(): void
    {
        this.okButton?.addEventListener('click', () => {
            this.closeDialog();
            this.utility.triggerEvent(this.element, 'Component.Dialog.Action.OK');
        });

        this.saveButton?.addEventListener('click', () => {
            this.closeDialog();
            this.utility.triggerEvent(this.element, 'Component.Dialog.Action.Save');
        });

        this.applyButton?.addEventListener('click', () => {
            this.closeDialog();
            this.utility.triggerEvent(this.element, 'Component.Dialog.Action.Apply');
        });

        this.deleteButton?.addEventListener('click', () => {
            this.closeDialog();
            this.utility.triggerEvent(this.element, 'Component.Dialog.Action.Delete');
        });

        this.cancelButton?.addEventListener('click', () => {
            this.closeDialog();
            this.utility.triggerEvent(this.element, 'Component.Dialog.Action.Cancel');
        });

        this.closeButton?.addEventListener('click', () => {
            this.closeDialog();
            this.utility.triggerEvent(this.element, 'Component.Dialog.Action.Close');
        });

        this.tabSwitchButtons.forEach((tabButton: HTMLButtonElement) => {
            const targetTabName = tabButton.dataset?.target;

            if (!targetTabName) {
                return;
            }

            tabButton.addEventListener('click', () => {
                this.showTab(targetTabName);
            });
        });
    }
}
