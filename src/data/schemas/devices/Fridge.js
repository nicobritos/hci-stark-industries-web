import CommonDeviceSchema from "@/data/schemas/devices/CommonDeviceSchema";
import apiWrapper from "@/data/apiWrapper";
import DeviceIds from "./DeviceIds";

// Data extracted from API Docs
const ACTION_NAMES = {
    setMode: "mode",
    setTemperature: "setTemperature",
    setFreezerTemperature: "setFreezerTemperature"
};

function adjustNumberRange(value, min, max) {
    value = Math.floor(value);
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

export default  class Fridge extends  CommonDeviceSchema{
    static minFridgeTemperature(){
        return 2;
    }
    static maxFridgeTemperature(){
        return 8;
    }
    static minFreezerTemperature(){
        return -20;
    }
    static maxFreezerTemperature(){
        return -8;
    }
    static supportedModes(){
        return ["default","vacation","party"];
    }

    static async create(name){
        let data = await CommonDeviceSchema._create(name,DeviceIds.byType.Fridge);
        return new Fridge(data.id,data.name,data.meta);
    }

    constructor(id, name, meta){
        super(id,name,meta,DeviceIds.byType.Fridge);
        this.temperature = Fridge.maxFridgeTemperature();
        this.freezerTemperature = Fridge.maxFreezerTemperature();
        this.mode = Fridge.supportedModes()[0];
    }

    async setTemperature(value){
        if(typeof value != "number")
            throw new Error("Invalid argument. Temperature should be of type numeric");

        value = adjustNumberRange(value,Fridge.minFridgeTemperature(),Fridge.maxFridgeTemperature());

        if(this.temperature === value)
            return false;

        let result = await apiWrapper.devices.performAction(
            this.id,
            ACTION_NAMES.setTemperature,
            {
                temperature: value
            }
        );

        if (result.result)
            this.temperature = value;

        return !!result.result;
    }

    async setFreezerTemperature(value){
        console.log("Veo si es un numero: " + value);
        if(typeof value != "number")
            throw new Error("Invalid argument. Freezer temperature should be of type numeric");

        value = adjustNumberRange(value,Fridge.minFreezerTemperature(),Fridge.maxFreezerTemperature());
        console.log("ajusto el numero: " + value);


        if(this.freezerTemperature === value)
            return false;

        console.log("El numero es distinto que el valor anterior");
        console.log("Hago la accion");
        let result = await apiWrapper.devices.performAction(
            this.id,
            ACTION_NAMES.setFreezerTemperature,
            {
                temperature: value
            }
        );

        console.log("la accion fue : " + result.result);

        if (result.result)
            this.freezerTemperature = value;

        return !!result.result;
    }

    async setMode(mode){
        if(!Fridge.supportedModes().includes(mode))
            throw new Error("Invalid argument. Mode is not supported");

        if(mode === this.mode)
            return false;

        let result = await apiWrapper.devices.performAction(
            this.id,
            ACTION_NAMES.setMode,
            {
                mode: mode
            }
        );

        if(result.result)
            this.mode = mode;

        return !! result.result;

    }

    async refreshState() {
        let state = await this._getState();
        this.temperature = Number.parseInt(state.temperature);
        this.freezerTemperature = Number.parseInt(state.freezerTemperature);
        this.mode = state.mode;
    }

}












