<template>

  <v-dialog v-model="errorDialog" persistent max-width="400px">
    <v-card dark raised>
      <v-card-title>
        <span class="headline" >Error</span>
      </v-card-title>
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="2">
            <v-icon color="red" x-large>error</v-icon>
          </v-col>
          <v-col md="10">
            <span class="subtitle-1">{{ message }}</span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-center">
        <div class="text-center">
          <v-btn color="blue" @click="errorDialog = false">OK</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ErrorDialog",
  props:{
    message:{
      type: String,
      required: true
    },
    open:{
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      errorDialog: false
    };
  },
  watch:{
    open:function (val) {
      console.log("CAMBIANDO");
      this.errorDialog = val;

    },
    errorDialog: function (val) {
      if(!val){
        console.log("Emiting Event:")
        this.$emit("CloseErrorDialog");
      }
    }
  }
};
</script>

<style scoped></style>
