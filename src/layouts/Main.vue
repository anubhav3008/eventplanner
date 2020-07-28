<template>
<div>
  <b-container fluid="sm">
    <b-row>
  <b-col lg="2">
    <b-nav vertical  toggle-class="text-dark" text="Electronics">
      <b-nav-item><v-link href="/">Events</v-link></b-nav-item>
      <b-nav-item><v-link href="/AddOrUpdate">AddOrUpdateEvent</v-link></b-nav-item>
  </b-nav>
  </b-col>
  <b-col lg="8">
  <slot></slot>
  </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
  import VLink from '../components/VLink.vue'
  export default {
    components: {
      VLink
    }
  }
</script>