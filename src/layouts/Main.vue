<template>
<div>
  <b-container fluid=true>
    <b-row>
  <b-col lg="12">
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