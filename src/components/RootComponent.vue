<script>
import SwaggerUIBundle from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {DefinitionGenerator} from '@/util/DefinitionGenerator'

export default {
  data() {
    return {
      apikey: "c2stRE9LNDRYaGRPcklxeEZCSkRIRHlUM0JsYmtGSnd0Q0pqb1lmWmEwVGJIUE1zZG9L",
      story: "",
      definition: "",
      showLoading: false,
      showResults: false,
      showError: false,
      submitsCount: 0,
      start: 0,
      elapsed: 0,
      generator: new DefinitionGenerator(this.apikey)
    }
  },
  methods: {
    renderSwaggerUI(definition) {
      gtag('event', 'api_success', {
        "count": this.submitsCount,
        "story": this.story,
        "definition": this.definition,
        "elapsed": this.elapsed
      });
      let swaggerUIOptions = {
        spec: definition,
        dom_id: '#swagger', // Determine what element to load swagger ui
        docExpansion: 'list',
        deepLinking: true, // Enables dynamic deep linking for tags and operations
        filter: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
      }

      /** Export to window for use in custom js */
      window.ui = SwaggerUIBundle(swaggerUIOptions);
      this.showResults = true;
      this.showLoading = false;
    },
    submit() {
      console.log("submitting " + this.story);
      this.showLoading = true;
      this.showError = false;
      this.submitsCount++;

      this.generator.generateDefinition(atob(this.apikey), this.story)
          .then(definition => {
            this.definition = JSON.stringify(definition);
            this.elapsed = (Date.now() - this.start) / 1000;
            this.renderSwaggerUI(definition);
          })
          .catch(error => {
            console.log("error: ", error);
            gtag('event', 'api_error', {
              "count": this.submitsCount,
              "story": this.story,
              "definition": this.definition,
              "elapsed": this.elapsed,
              "error": error
            });
            this.showError = true;
            this.showLoading = false;
          });
    }
  }
}
</script>

<template>
  <div class="container" id="app">
    <div class="row">
      <div class="col-md-12">
        <div class="row-md">
          <h1 class="font-weight-bold text-primary rounded">API Companion</h1>
        </div>
        <div class="row-md">
          <p class="text-muted">API Companion is a web application that leverages OpenAI artificial
            intelligence to streamline the API design process</p>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <div class="row-md"><h5 class="text-primary">User stories</h5> <textarea id="story" class="form-control" rows=10
                                                                                 v-model="story"
                                                                                 placeholder="1. As a librarian i want to retrieve the list of books in the library"
                                                                                 :disabled="showLoading"></textarea>
        </div>
        <div class="row-md" style="margin-top:10px"><a id="submit" class="btn btn-light" v-show="!showLoading" href="#"
                                                       v-on:click="submit">SUBMIT</a>
          <div class="row-md">
            <div id="loading" v-show="showLoading" class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div>
        <div class="row-md" style="margin-top:10px">
          <div class="alert alert-primary" role="alert">
            Tip! The more you write, the better the outcome will be.
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row-md" v-show="showError">
          <div class="alert alert-danger" role="alert">
            An unexpected error occured!
          </div>
        </div>
        <div class="row-md" v-show="showResults">
          <h5 class="text-primary">Swagger UI</h5>
          <div class="swagger border border-light rounded" id="swagger"></div>
        </div>
        <div class="row-md" v-if="showResults">
          <h5 class="text-primary">OpenAPI Definition</h5><textarea id="definition" class="form-control" rows=40
                                                                    v-model="definition"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
