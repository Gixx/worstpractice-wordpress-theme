import { Utility } from './Utility';
import { Logger } from './Logger';

type Enctype = 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data' | string;

export class Http {
    private readonly utility: Utility;
    private readonly logger: Logger;

    constructor(utilityInstance: Utility, loggerInstance: Logger) {
        this.utility = utilityInstance;
        this.logger = loggerInstance;
        this.logger.serviceLoaded();
        this.initialize();
    }

    // Initializes the component and notifies listeners
    private initialize(): void {
        this.utility.triggerEvent(document, 'Service.Http.Ready', null, 1);
    }

    // Makes an XmlHttpRequest. Response body is returned as string by default.
    private doXmlHttpRequest<T = string>(
        url: string,
        method: string,
        async: boolean,
        enctype: Enctype,
        data: FormData | Record<string, unknown>,
        successCallback: (response: T) => void,
        failureCallback: (response: T) => void
    ): XMLHttpRequest {
        const rnd = new Date().getTime();
        url = url + (url.lastIndexOf('?') === -1 ? '?' : '&') + 'timestamp=' + rnd;

        const xhr = new XMLHttpRequest();
        xhr.open(method, url, async);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                try {
                    if (xhr.status === 200) {
                        successCallback(xhr.responseText as unknown as T);
                    } else {
                        failureCallback(xhr.responseText as unknown as T);
                    }
                } catch (exp) {
                    this.logger.warn('JSON parse error. Continue', exp as Error);
                }
            }
        };

        // Use intermediate variables to avoid mutating the `data` parameter directly
        let dto: FormData | Record<string, unknown> = data; // data transfer object after utility conversions
        let composedData: XMLHttpRequestBodyInit | Document | null | undefined; // final value to be passed to xhr.send

        // if NOT multipart/form-data, turn the FormData into object
        if (dto instanceof FormData && enctype !== 'multipart/form-data') {
            dto = this.utility.formDataToObject(dto);
        }

        // if multipart/form-data, turn the data into FormData
        if (!(dto instanceof FormData) && enctype === 'multipart/form-data') {
            dto = this.utility.objectToFormData(dto as Record<string, unknown>);
        }

        // Prepare body and headers depending on enctype
        switch (enctype) {
            case 'application/json':
                composedData = JSON.stringify(dto as Record<string, unknown>);
                xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                break;

            case 'application/x-www-form-urlencoded':
                composedData = Object.keys(dto as Record<string, unknown>)
                    .map((key) => key + '=' + encodeURIComponent(String((dto as Record<string, unknown>)[key] ?? '')))
                    .join('&');
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                break;

            case 'multipart/form-data':
                // When using multipart/form-data with XHR you should typically NOT set Content-Type
                // because the browser will include the correct boundary. If the final body is FormData
                // let the browser set the header. If it's not FormData, we attempt to set a generic header
                if (dto instanceof FormData) {
                    composedData = dto;
                } else {
                    // dto should already be converted above, but fallback defensively
                    composedData = this.utility.objectToFormData(dto as Record<string, unknown>);
                }
                try {
                    if (!(composedData instanceof FormData)) {
                        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                    }
                } catch (e) {
                    // ignore header-setting errors
                }
                break;

            default:
                // If enctype unknown, just attempt to send dto directly (FormData or stringable)
                composedData = dto instanceof FormData ? dto : (dto as unknown as XMLHttpRequestBodyInit);
                break;
        }

        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(composedData as Document | XMLHttpRequestBodyInit | null);

        return xhr;
    }

    // Fetch wrapper - returns the Promise returned by fetch and invokes callbacks
    private doFetch<T = Response>(
        url: string,
        method: string,
        _async: boolean, // fetch is always async; kept for signature compatibility
        enctype: Enctype,
        data: FormData | Record<string, unknown>,
        successCallback: (response: T) => Promise<T> | T,
        failureCallback: (response: unknown) => Promise<never> | never
    ): Promise<T | unknown> {
        // Use local variables to avoid mutating the `data` parameter
        let dto: FormData | Record<string, unknown> = data;
        let requestBody: BodyInit | FormData | null | undefined;

        switch (enctype) {
            case 'application/json':
                if (dto instanceof FormData) {
                    dto = this.utility.formDataToObject(dto);
                }
                requestBody = JSON.stringify(dto as Record<string, unknown>);
                break;

            case 'application/x-www-form-urlencoded':
                if (dto instanceof FormData) {
                    dto = this.utility.formDataToObject(dto);
                }
                requestBody = Object.keys(dto as Record<string, unknown>)
                    .map((key) => key + '=' + encodeURIComponent(String((dto as Record<string, unknown>)[key] ?? '')))
                    .join('&');
                break;

            case 'multipart/form-data':
                if (!(dto instanceof FormData)) {
                    dto = this.utility.objectToFormData(dto as Record<string, unknown>);
                }
                requestBody = dto as FormData;
                break;

            default:
                requestBody = dto instanceof FormData ? dto : (dto as unknown as BodyInit);
                break;
        }

        // Build headers; if body is FormData, do not set Content-Type so the browser can set boundary
        const headers: Record<string, string> = {
            'X-Requested-With': 'XMLHttpRequest'
        };

        if (!(requestBody instanceof FormData)) {
            headers['Content-Type'] = enctype;
        }

        const request: RequestInit = {
            method,
            headers
        } as RequestInit;

        if (method !== 'GET' && method !== 'HEAD') {
            request.body = requestBody as BodyInit;
        }

        this.logger.actionTriggered('Fetching URL', url);

        return fetch(url, request)
            .then((response) => {
                if (response.ok) {
                    this.logger.actionSuccess('URL fetch successful', url);
                    return successCallback(response as unknown as T);
                }

                return failureCallback(response);
            })
            .catch((err) => {
                this.logger.actionFailed('URL fetch failed', url);
                // Re-throw so callers can handle it as well
                throw err;
            });
    }

    // Public API: ajax - XMLHttpRequest style
    public ajax(
        url = '/',
        method = 'POST',
        async = true,
        enctype: Enctype = 'application/json',
        data: FormData | Record<string, unknown> = {},
        successCallback: ((data: string) => void) | null = null,
        failureCallback: ((data: string) => void) | null = null
    ): XMLHttpRequest {
        const success = typeof successCallback === 'function' ? successCallback : () => {};
        const failure = typeof failureCallback === 'function' ? failureCallback : () => {};

        return this.doXmlHttpRequest<string>(url, method, async, enctype, data, success, failure);
    }

    // Public API: fetch - Fetch API style
    public fetch<T = Response>(
        url = '/',
        method = 'POST',
        async = true,
        enctype: Enctype = 'application/json',
        data: FormData | Record<string, unknown> = {},
        successCallback: ((data: T) => Promise<T> | T) | null = null,
        failureCallback: ((data: unknown) => Promise<never> | never) | null = null
    ): Promise<T | unknown> {
        const success = typeof successCallback === 'function'
            ? successCallback
            : ((response: T) => Promise.resolve(response));

        const failure = typeof failureCallback === 'function'
            ? failureCallback
            : ((resp: unknown) => Promise.reject(resp));

        return this.doFetch<T>(url, method, async, enctype, data, success, failure);
    }
}
