import {CLIENT} from "./index";

class ClientLoader {
    private static instance: ClientLoader | null = null;
    private readonly _client: CLIENT;

    constructor() {
        this._client = new CLIENT();
    }

    public get client(): CLIENT {
        return this._client;
    }

    public static getInstance(): ClientLoader {
        if (!ClientLoader.instance) {
            ClientLoader.instance = new ClientLoader();
        }

        return ClientLoader.instance;
    }
}

export const loader = ClientLoader.getInstance();
export default loader;