import { CookieStorage } from "./Repository/CookieStorage";
import { LocalStorage } from "./Repository/LocalStorage";

import { Utility } from './Service/Utility';
import { Logger } from './Service/Logger';
import { Http } from './Service/Http';
import { SmoothScroll } from './Service/SmoothScroll';

import { BarChart } from "./Components/BarChart";
import { Collapsible } from "./Components/Collapsible";
import {DialogWindow} from "./Components/DialogWindow";
import { LazyLoadImage } from "./Components/LazyLoadImage";

const PRIVACY_ACCEPT_STORAGE_NAME = 'privacy_Accept_20251119';

let dialogWindowHandler: DialogWindow;

declare global {
    interface Window { openDialog: any; }
}

document.addEventListener('DOMContentLoaded', function () {
    const utility = new Utility(
        new Logger('Utility', 'Salmon')
    );
    const http = new Http(
        utility,
        new Logger('Http', 'GreenYellow')
    );

    new SmoothScroll(
        utility,
        new Logger('Smooth Scroll', 'SteelBlue')
    );

    let dataStorage;

    try {
        dataStorage = new LocalStorage(
            utility,
            new Logger('Local Storage', 'SpringGreen')
        );
    } catch (e) {
        console.error(e);
        dataStorage = new CookieStorage(
            utility,
            new Logger('Cookie Storage', 'SpringGreen')
        );
        dataStorage.renew(PRIVACY_ACCEPT_STORAGE_NAME);
    }

    new Collapsible(
        utility,
        new Logger('Collapsible', 'PaleGoldenRod')
    )

    new BarChart(
        utility,
        new Logger('Bar Chart', 'MediumPurple')
    );

    dialogWindowHandler = new DialogWindow(
        utility,
        new Logger('Dialog Window', 'Turquoise')
    );

    new LazyLoadImage(
        utility,
        new Logger('Lazy Load Image', 'PowderBlue')
    );
});

window.openDialog = function (dialogName: string): void {
    dialogWindowHandler.getDialogByName(dialogName)?.open();
}
