import apiWrapper from "@/data/apiWrapper";

// Data extracted from API Docs
const ACTION_NAMES = {
  getState: "getState"
};

export default class CommonDeviceSchema {
  static _formatMeta(meta) {
    return JSON.stringify(meta);
  }

  static async create(name, deviceId, customMetadata) {
    let meta = {
      favourite: false
    };
    if (customMetadata != null) {
      meta = Object.assign(meta, customMetadata);
    }

    let result = await apiWrapper._createDevice({
      typeId: deviceId,
      name: name,
      meta: this._formatMeta(meta)
    });

    return { id: result.device.id, name: name, meta: meta };
  }

  constructor(id, name, meta, deviceId) {
    this.id = id;
    this.name = name;
    this.meta = meta;
    this.deviceId = deviceId;
  }

  async setFavourite(value) {
    let nextValue = !!value;
    if (this.meta.favourite === nextValue) return false;

    let metaCopy = Object.assign({}, this.meta);
    metaCopy.favourite = nextValue;
    let result = await apiWrapper._updateDevice(this.id, {
      name: name,
      typeId: this.deviceId,
      id: this.id,
      meta: CommonDeviceSchema._formatMeta(metaCopy)
    });

    // eslint-disable-next-line require-atomic-updates
    if (result.result) this.meta.favourite = nextValue;
    return result.result;
  }

  async changeName(newName) {
    if (typeof newName !== "string") return false;
    newName = newName.trim();
    let result = await apiWrapper._updateDevice(this.id, {
      name: newName,
      meta: this.meta,
      typeId: this.deviceId
    });
    if (result.result) this.name = newName;
    return result.result;
  }

  async addToRoom(roomId) {
    let result = await apiWrapper._addDeviceToRoom(this.id, roomId);
    return result.result;
  }

  async deleteFromRooms() {
    let result = await apiWrapper._deleteDeviceFromRooms(this.id);
    return result.result;
  }

  async _getState() {
    let result = await apiWrapper._performActionOnDevice(
      this.id,
      ACTION_NAMES.getState
    );

    return result.result;
  }

  async refreshInformation() {
    let result = await apiWrapper.getDevice(this.id);
    this.name = result.device.name;
    this.meta = JSON.parse(result.device.meta);
    return true;
  }

  async refreshState() {
    throw new Error("This method should be overwritten");
  }

  async delete() {
    return (await apiWrapper._deleteDevice(this.id)).result;
  }
}
