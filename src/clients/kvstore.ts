import axios, { AxiosResponse  } from 'axios';
import { AppsPluginName, Routes } from '../constant';
import { KVStoreProps, KVStoreOptions } from '../types';

export class KVStoreClient {
    private readonly config: KVStoreOptions;

    constructor(
        config: KVStoreOptions
    ) {
        this.config = config;
    }

    public kvSet(key: string, value: KVStoreProps): Promise<any> {
        const url = `${this.config.mattermostUrl}/plugins/${AppsPluginName}${Routes.MM.ApiVersionV1}${Routes.MM.PathKV}/${key}`;
        return axios.post(url, value, {
            headers: {
                Authorization: `BEARER ${this.config.accessToken}`,
                'content-type': 'application/json; charset=UTF-8',
            },
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public kvGet(key: string): Promise<KVStoreProps> {
        const url = `${this.config.mattermostUrl}/plugins/${AppsPluginName}${Routes.MM.ApiVersionV1}${Routes.MM.PathKV}/${key}`;
        return axios.get(url, {
            headers: {
                Authorization: `BEARER ${this.config.accessToken}`,
                'content-type': 'application/json; charset=UTF-8',
            },
        }).then((response: AxiosResponse<any>) => response.data);
    }
}
