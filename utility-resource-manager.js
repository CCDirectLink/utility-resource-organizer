export default class UtilityResourceManager {

    constructor() {
        this.keys = new Map;
        this.keyListeners = new Map;
    }

    async addResourceGenerator(key, callback) {
        if (!this.keys.has(key)) {
            this.keys.set(key, []);
        }
        const resourceDataCb = { type: 'generator', data: callback };
        this.keys.get(key).push(resourceDataCb);
        await this.callListeners(key, resourceDataCb);
    }

    async addResourceData(key, data) {
        if (!this.keys.has(key)) {
            this.keys.set(key, []);
        }
        const resourceDataRaw = { type: 'raw', data: data };
        this.keys.get(key).push(resourceDataRaw);
        await this.callListeners(key, resourceDataRaw);
    }

    async addResourceListener(key, callback) {
        if (!this.keyListeners.has(key)) {
            this.keyListeners.set(key, []);
        }

        this.keyListeners.get(key).push(callback);

        if (this.keys.has(key)) {
            const keyData = this.keys.get(key);
            for (const data of keyData) {
                await this.callListener(callback, data);
            }
        }
    }

    removeResourceListener(key, callback) {
        if (this.keyListeners.has(key)) {
            const listeners = this.keyListeners.get(key);
            let index;
            do {
                index = listeners.indexOf(callback)
                if (index === -1) {
                    break;
                }
                listeners.splice(index, 1);
            } while (true)

        }
    }

    async callListeners(key, data) {
        if (this.keyListeners.has(key)) {
            const listeners = this.keyListeners.get(key);
            for (const listener of listeners) {
                await this.callListener(listener, data);
            }
        }

    }

    async callListener(listener, data) {
        try {
            await listener(data);
        } catch (e) {
            console.error(e);
        }
    }
}