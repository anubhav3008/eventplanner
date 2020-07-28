<template>
<div>
        <b-form>
         <b-col lg="4"><b-form-input type="text" v-model="user.id" placeholder="toastmasters Id"> </b-form-input></b-col>
         <b-col lg="4"><b-form-input type="text" v-model="user.name" placeholder="name"> </b-form-input></b-col> 
         <b-col lg="4"><b-form-input type="text" v-model="user.emailId" placeholder="email"> </b-form-input></b-col> 
          <div align="center">
         <b-button variant="primary" v-on:click="addUser">add User</b-button>
         </div>
        </b-form>
 
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
                usersList:"",
                 usersListFields:['id','name','emailId'],
                 user : {}
              }
        },
        methods: {
            search(){
                axios
                    .get('https://srtmc-backend.azurewebsites.net/mgtc-1.0.0/users')
                    .then(response => (this.usersList = response.data))
                    .catch(error => console.log(error))
            },
            addUser(){
            this.user.isActive =  true;
            this.user.active=true;
                axios
                    .post('https://srtmc-backend.azurewebsites.net/mgtc-1.0.0/users/add',
                        this.user
                    )
                    .then(
                    response => {
                    alert(response.data.success)
                    this.search()
                    this.user = {}
                    }
                    )
                    .catch(error => console.log(error))
            }
        },
        created:function () {
         this.search();
        }
    }
</script>