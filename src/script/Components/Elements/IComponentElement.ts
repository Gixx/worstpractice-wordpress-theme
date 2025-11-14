export interface IComponentElement<T extends HTMLElement = HTMLElement> {
    getId(): string | number;
    getName(): string;
    getHTMLElement(): T;
}
