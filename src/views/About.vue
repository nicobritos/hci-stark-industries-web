<template
  ><v-container grid-list-md>
  <Breadcrumbs class="mb-4" :items="breadcrumbs"></Breadcrumbs>
  <v-card>
      <v-card-title>
        <h2>
          About
        </h2>
      </v-card-title>
      <v-card-text>
        This website allows managing data from surveys made on workshops about
        Sensitization about Climate Change.
      </v-card-text>
      <v-card-text></v-card-text>
      <v-card-text>
        Current version: 0.1.0b
      </v-card-text>
      <v-card-text>
        Created by: Nicolas Ignacio Britos. Contact at:
        <a href="mailto:nicbritos@hotmail.com"> nicbritos@hotmail.com</a> or
        <a href="mailto:nbritos@itba.edu.ar">
          nbritos@itba.edu.ar
        </a>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import Breadcrumbs from "@/components/Breadcrumbs";
  import routes from "@/router/routes";
  export default {
    name: "About",
    components: { Breadcrumbs },
    data: () => ({
      snackbar: false,
      loading: false,
      breadcrumbs: [
              Object.assign({}, routes.breadcrumbs.about)
              ]
    }),
    mounted() {
      this.breadcrumbs[0].disabled = true;
    }
  };
</script>
