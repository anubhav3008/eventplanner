<template>
<div>
    <b-table striped hover small responsive=true stacked="sm" :items="usersList" :fields="usersListFields"></b-table>
    
</div>    
</template>

<script>

    import axios from 'axios'
    import VueAxios from 'vue-axios'
    import Vue from 'vue'
    Vue.use(VueAxios, axios)
    export default {

        data(){
            return{
                usersList:[],
                 usersListFields:['title','description','users', 'tags', 'scheduledOn', 'createdBy']
              }
        },
        methods: {
            search(){
               this.usersList.push({"title":"Lets play mafia","description":"Its weekend coming, lets play :)","users":["Anubhav Shrivastava"," ,Shakun Grover"],"tags":["gaming"],"createdBy":"Anubhav Shrivastava","scheduledOn":"28/07/20 01:10:15 - pm"});
               this.usersList.push({"title":"Chess anyone?","description":"Have been so long :(","users":["Ajay Suri"],"tags":["entertainment"],"createdBy":"Ajay Suri","scheduledOn":"30/07/20 10:10:15 - pm"});
               this.usersList.push({"title":"Toastmasters","description":"Learn public speaking & shed your inhibitions","users":["Siddhant Bhatt"],"tags":["public speaking"],"createdBy":"Siddhant Bhatt","scheduledOn":"01/08/20 01:10:15 - pm"});

            }
        },
        created:function () {
         this.search();
        }
    }
</script>