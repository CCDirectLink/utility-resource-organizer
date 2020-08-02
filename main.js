import UtilityResourceManager from "./utility-resource-manager.js";
export default class UtilityResourceMod {
    constructor() {
        window.UtilityResourceManager = new UtilityResourceManager;
    }

    async preload() {
        
        for (const [name, mod] of modloader.loadedMods) {
            try {
                await mod.executeStage('registerResourceListener');
            } catch (e) {
                console.log('Mod', e, 'failed');
                console.log(e.toString());
            }
        }

        for (const [name, mod] of modloader.loadedMods) {
            try {
                await mod.executeStage('registerResourceGenerator');
            } catch (e) {
                console.log('Mod', e, 'failed');
                console.log(e.toString());
            }
            
        }
    }
}