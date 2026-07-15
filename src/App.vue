<script setup lang="ts">
import { mdiImageEditOutline } from '@mdi/js'
</script>

<template>
  <v-app>
    <v-app-bar border="b" flat>
      <v-app-bar-title>LiveArt</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container class="app-placeholder" fluid>
        <v-icon :icon="mdiImageEditOutline" size="48" />
        <h1 class="text-h4">Image editor</h1>
        <p class="text-body-1 text-medium-emphasis">Workspace is ready</p>
      </v-container>
    </v-main>
  </v-app>
</template>
