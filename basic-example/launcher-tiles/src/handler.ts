import {URLExt} from '@jupyterlab/coreutils';

import {ServerConnection} from '@jupyterlab/services';

export async function requestTemplate<T>(
    template = '',
    init: RequestInit = {}
): Promise<T> {
    const settings = ServerConnection.makeSettings();
    const requestUrl = URLExt.join(
        settings.baseUrl,
        'launcher_tiles/templates',
        template
    );

    let response: Response;
    try {
        response = await ServerConnection.makeRequest(requestUrl, init, settings);
    } catch (error) {
        throw new ServerConnection.NetworkError(error as any);
    }

    let data: any = await response.text();

    if (data.length > 0) {
        try {
            data = JSON.parse(data);
        } catch (error) {
            console.log('Not a JSON response body.', response);
        }
    }

    if (!response.ok) {
        throw new ServerConnection.ResponseError(response, data.message || data);
    }

    return data;
}
