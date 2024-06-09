import { RouletteConfig } from '../models/RouletteConfig';

const CONFIG_ENDPOINT: string =
    'https://nnqzz5jk54qd6m3rd7rmnl3rca0fjcrv.lambda-url.eu-west-3.on.aws/?userId=mla';

export const getRouletteConfig = async (): Promise<RouletteConfig> => {
    const response = await fetch(CONFIG_ENDPOINT);
    const rouletteConfig: RouletteConfig = await response.json();

    return rouletteConfig;
};
