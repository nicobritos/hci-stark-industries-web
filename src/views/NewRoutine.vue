<template>
  <v-container grid-list-md fluid>
    <v-dialog v-model="dialogs.devices.add" max-width="800px">
      <v-card>
        <!--        <v-img-->
        <!--          class="white&#45;&#45;text"-->
        <!--          src="@/assets/question_blue.png"-->
        <!--          position="top center"-->
        <!--          max-height="300"-->
        <!--        >-->
        <!--        </v-img>-->
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col>
                <h1 style="color: black">Add Device</h1>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col>
                <DeviceContainer
                  :room="true"
                  :editable="false"
                  :pick="true"
                  :items="devices"
                  @pick="addDeviceClose"
                >
                </DeviceContainer>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="addDeviceClose(null)" v-blur
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogs.devices.configure" max-width="800px">
      <v-card>
        <!--        <v-img-->
        <!--          class="white&#45;&#45;text"-->
        <!--          src="@/assets/question_blue.png"-->
        <!--          position="top center"-->
        <!--          max-height="300"-->
        <!--        >-->
        <!--        </v-img>-->
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col>
                <h1 style="color: black">
                  Configure Device: {{ selectedDevice.name }}
                </h1>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col>
                CONFIGURAR
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="configureDeviceClose(false)" v-blur
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="configureDeviceClose(true)" v-blur
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col>
        <v-toolbar flat color="transparent">
          <v-toolbar-title>
            <h2>
              New Routine
            </h2>
          </v-toolbar-title>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-stepper vertical v-model="data.stepper">
          <template>
            <v-stepper-step
              step="1"
              :rules="[() => data.stepper !== 1 || !data.error]"
              :complete="data.stepper > 1 && !data.error"
            >
              Enter Name
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="data.name"
                    label="Enter Name"
                    clearable
                    :error="data.error"
                    :error-messages="data.errorMessages"
                    @input="validateName(data.name)"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-spacer></v-spacer>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    text
                    v-blur
                    color="primary"
                    @click="data.stepper++"
                    :disabled="data.error || data.name == null"
                    >Continue</v-btn
                  >
                </v-col>
              </v-row>
            </v-stepper-content>

            <v-stepper-step
              step="2"
              :rules="[() => data.stepper !== 2 || !data.error]"
              :complete="data.stepper > 2 && !data.error"
            >
              Enter Description
            </v-stepper-step>

            <v-stepper-content step="2">
              <v-row dense>
                <v-col>
                  <span class="text--secondary">
                    For Routine:
                    <span class="blue--text">'{{ data.name }}'</span>
                  </span>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <v-text-field
                    v-model="data.description"
                    label="Enter Description"
                    clearable
                    :error="data.error"
                    :error-messages="data.errorMessages"
                    @input="validateDescription(data.description)"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-spacer></v-spacer>
                </v-col>
                <v-col cols="auto">
                  <v-btn text v-blur color="primary" @click="backOneStep"
                    >Back</v-btn
                  >
                  <v-btn
                    text
                    v-blur
                    color="primary"
                    @click="data.stepper++"
                    :disabled="data.error || data.description == null"
                    >Continue</v-btn
                  >
                </v-col>
              </v-row>
            </v-stepper-content>

            <v-stepper-step
              step="3"
              :rules="[() => data.stepper !== 3 || !data.error]"
              :complete="data.stepper > 3 && !data.error"
            >
              Select Devices
            </v-stepper-step>

            <v-stepper-content step="3">
              <v-row dense>
                <v-col>
                  <span class="text--secondary">
                    For Routine:
                    <span class="blue--text">'{{ data.name }}'</span>
                  </span>
                  <div class="text--secondary">
                    <u>Note</u>: actions on Devices will be executed in order.
                  </div>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col> </v-col>
                <v-col cols="auto">
                  <v-btn
                    text
                    outlined
                    color="primary"
                    class="ml-3 mb-2"

                    v-blur
                    @click="addDeviceOpen"
                    >ADD DEVICE</v-btn
                  >
                </v-col>
              </v-row>

              <v-row dense>
                <v-col>
                  <OrderedBoxContainer :items="selectedDevices">
                    <template v-slot:item="{ item }">
                      <Device
                        :room="true"
                        :editable="false"
                        :device="item"
                      ></Device>
                    </template>
                  </OrderedBoxContainer>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-spacer> </v-spacer>
                </v-col>
                <v-col cols="auto">
                  <v-btn text v-blur color="primary" @click="backOneStep"
                    >Back</v-btn
                  >
                  <v-btn
                    text
                    v-blur
                    color="primary"
                    @click="data.stepper++"
                    :disabled="data.error || data.selectedDevices.length === 0"
                    >Continue</v-btn
                  >
                </v-col>
              </v-row>
            </v-stepper-content>
          </template>
        </v-stepper>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-spacer></v-spacer>
      </v-col>

      <v-col cols="auto">
        <v-btn color="blue darken-1" text @click="onCancel" v-blur
          >Cancel</v-btn
        >
        <v-btn
          :disabled="
            data.stepper < 3 || data.error || data.selectedDevices.length === 0
          "
          color="blue darken-1"
          text
          @click="onSave"
          v-blur
          :loading="data.loading"
          >Save</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import OrderedBoxContainer from "@/components/containers/OrderedBoxContainer";
import DeviceContainer from "@/components/containers/DeviceContainer";
import Device from "@/components/individuals/Device";

export default {
  name: "NewRoutine",
  components: { OrderedBoxContainer, DeviceContainer, Device },
  model: {
    events: ["cancel", "save"]
  },
  data() {
    return {
      data: {},
      dialogs: {
        devices: {
          add: true,
          configure: false
        }
      },
      devices: this.$store.state.devices.items,
      selectedDevice: {},
      selectedDeviceConfiguration: {},
      selectedDevices: [],
      favouriteDevices: this.$store.state.devices.favourites
    };
  },
  computed: {
    defaultData() {
      return {
        stepper: 3,
        description: null,
        name: null,
        selectedDevices: [],
        error: false,
        errorMessages: [],
        loading: false
      };
    },
    roomStep() {
      if (this.region == null) return 2;
      return 1;
    },
    deviceStep() {
      if (this.region == null) return 3;
      if (this.room == null) return 2;
      return 1;
    },
    nameStep() {
      return this.deviceStep + 1;
    },

    regions() {
      return [
        {
          name: "Planta Baja",
          id: "ABC1"
        }
      ];
    },
    rooms() {
      return [
        {
          name: "Comedor",
          id: "ABC2"
        }
      ];
    }
  },
  created() {
    this.resetData();
  },
  methods: {
    addDeviceOpen() {
      this.openDialog(this.dialogs.devices, "add");
    },
    addDeviceClose(item) {
      // Save to DB
      if (item != null) {
        this.configureDeviceOpen();
        this.selectedDevice = item;
      } else {
        this.closeDialog(this.dialogs.devices, "add");
      }
    },
    configureDeviceOpen() {
      this.openDialog(this.dialogs.devices, "configure");
      this.openDialog(this.dialogs.devices, "add");
    },
    configureDeviceClose(result) {
      // Save to DB
      if (result) {
        this.selectedDevices.push(this.selectedDevice);
        this.closeDialog(this.dialogs.devices, "configure");
        this.closeDialog(this.dialogs.devices, "add");
      } else {
        this.closeDialog(this.dialogs.devices, "configure");
      }
    },

    openDialog(item, type) {
      if (item == null || type == null || item[type] == null) return;
      if (!item[type]) item[type] = true;
    },
    closeDialog(item, type) {
      if (item == null || type == null || item[type] == null) return;
      if (item[type]) item[type] = false;
    },

    resetData() {
      this.data = Object.assign({}, this.defaultData);
    },
    backOneStep() {
      if (this.data.stepper === 4) {
        this.data.stepper--;
        this.data.name = null;
      } else if (this.data.stepper === 3) {
        if (this.room == null) {
          this.data.stepper--;
          this.data.device = null;
        }
      } else if (this.data.stepper === 2) {
        if (this.region == null) {
          this.data.stepper--;
          this.selectedRoom = null;
        }
      }

      this.data.error = false;
      this.data.errorMessages = [];
    },

    getDeviceName(deviceId) {
      if (deviceId === "L") return "Light";
      if (deviceId === "AC") return "Air Conditioner";
      return "N/A";
    },

    validateName(name) {
      let messages = [];
      if (typeof name !== "string" || name.trim().length === 0)
        messages.push("Please, enter a Name");
      this.data.errorMessages = messages;
      this.data.error = messages.length > 0;
    },
    validateDescription(description) {
      let messages = [];
      if (typeof description !== "string" || description.trim().length === 0)
        messages.push("Please, enter a Description");
      this.data.errorMessages = messages;
      this.data.error = messages.length > 0;
    },
    validateDevices() {
      let messages = [];
      if (this.data.devices.length === 0)
        messages.push("Please, select at least one Device");
      this.data.errorMessages = messages;
      this.data.error = messages.length > 0;
    },

    onCancel() {
      this.$emit("cancel");
    },
    onSave() {
      let newDevice = {
        region: this.region != null ? this.region : this.data.selectedRegion,
        room: this.room != null ? this.room : this.data.selectedRoom,
        device: this.data.device,
        name: this.data.name
      };
      this.data.loading = true;
      this.$emit("save", newDevice);
    }
  }
};
</script>

<style scoped></style>
