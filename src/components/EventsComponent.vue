<template>
<div>

         <h3>Subscribed</h3>
    <b-table striped hover small responsive=true stacked="sm" :items="subscribedList" :fields="fieldsList">

            <template slot="Subscribe" slot-scope="row">
                     <b-button size="sm" @click.stop="toggle(row.index, subscribedList)">{{ isCurrentUserPresentInCurrentIndex(row.index, subscribedList)? "Unsubscribe":"Subscribe" }}</b-button>
            </template>
    </b-table>

       <h3>Ongoing</h3>
    <b-table striped hover small responsive=true stacked="sm" :items="usersList" :fields="fieldsList">

           <template slot="Subscribe" slot-scope="row">
                     <b-button size="sm" @click.stop="toggle(row.index, usersList)">{{ isCurrentUserPresentInCurrentIndex(row.index, usersList)? "Unsubscribe":"Subscribe" }}</b-button>
            </template>

    </b-table>
    <h3>Up Coming</h3>
     <b-table striped hover small responsive=true stacked="sm" :items="upcoming" :fields="fieldsList">
            <template slot="Subscribe" slot-scope="row">
                     <b-button size="sm" @click.stop="toggle(row.index, upcoming)">{{ isCurrentUserPresentInCurrentIndex(row.index, upcoming)? "Unsubscribe":"Subscribe" }}</b-button>
            </template>



     </b-table>

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
                upcoming : [],
                usersListBase : [],
                
                rawUpcoming : [],
                rawSubscribed : [],
                rawOngoing : [],
                


              currentUserEmail : "anshriv@microsoft.com",
              currentUserName : "Anubhav Shrivastava",
              subscribedList :[],
              fieldsList: ['Title', 'Description', 'Participants', 'Participants', 'Oraganizer', 'Subscribe']
              }
        },
        
        methods: {
               isCurrentUserPresentInCurrentIndex(x, events){
                      return  events[x].Participants.includes(this.currentUserName);
                         
               },
               toggle(x, events){
                      if(this.isCurrentUserPresentInCurrentIndex(x,events)){
                       this.unsubscribe(x,events);      
                      }
                      else{
                             this.subscribe(x,events);
                      }
               },
              unsubscribe(x, events){
                     console.log(JSON.stringify(events));
                      events[x].Participants = events[x].Participants.replace(this.currentUserName,"");
                      if(events[x].Participants.endsWith("|")){
                            events[x].Participants = events[x].Participants.substring(0, events[x].Participants.length - 1)
                     }
              },
              subscribe(x, events){
                     console.log(JSON.stringify(events));
                     if(events[x].Participants.endsWith("|")){
                            events[x].Participants = events[x].Participants.concat(this.currentUserName+ "|");
                     }
                     else{
                                  events[x].Participants = events[x].Participants.concat("|"+this.currentUserName+ "|");
                     }

                     

              },
             search(){
                    for(var x= 0; x< this.usersListBase.length; x++){
                         var user  = {};
                         user.Title = this.usersListBase[x].title;
                         user.Description = this.usersListBase[x].description;
                         user.Participants = "";
                         for(var i=0;i< this.usersListBase[x].users.length ; i++){
                                user.Participants = user.Participants + this.usersListBase[x].users[i].name;
                                if(i+1!= this.usersListBase[x].users.length){
                                       user.Participants = user.Participants + "|";
                                }
                         }
                         
                         user.tags = "";
                         for( var i=0; i< this.usersListBase[x].tags.length; i++){
                                user.tags = user.tags + this.usersListBase[x].tags[i];
                                if(i+1!= this.usersListBase[x].tags.length){
                                       user.tags = user.tags+ "|";
                                }
                         }
                         user.Oraganizer = this.usersListBase[x].createdBy.name;
                         console.log("date found  = "+ this.usersListBase[x].scheduledOn);
                         var EventStartTime  = new Date(this.usersListBase[x].scheduledOn);
                         
                         var currentTime = new Date();
                         console.log(EventStartTime.getTime());
                         console.log(currentTime.getTime());
                         console.log(EventStartTime.getTime() + parseInt(this.usersListBase[x].timeInMunutes) *60000);

                         var start = parseInt(EventStartTime.getTime());
                         var end = parseInt(EventStartTime.getTime() + parseInt(this.usersListBase[x].timeInMunutes) *60000);
                         var current = new Date().getTime();

                         var subscribed = false;
                         
                         
                         for( var i=0; i< this.usersListBase[x].users.length; i++){
                                console.log("emaid id found  = "+ this.usersListBase[x].users[i].email +" & ccurrent mail="+ this.currentUserEmail+ "comp= "+ this.usersListBase[x].users[i].email.localeCompare(this.currentUserEmail));
                                if(this.usersListBase[x].users[i].email == this.currentUserEmail){

                                       this.subscribedList.push(user);
                                       this.rawSubscribed.push(this.usersListBase[x])
                                       subscribed = true;
                                       break;

                                }
                         }

                         if(start < current && end > current && !subscribed ){
                                 this.rawOngoing.push(this.usersListBase[x])

                                this.usersList.push(user);  // ongoing
                         }

                         else if (!subscribed){
                                 this.rawUpcoming.push(this.usersListBase[x])
                                this.upcoming.push(user);
                         }

                         user.Time = EventStartTime.toDateString() + " " + EventStartTime.toLocaleTimeString();

                   }
            }
        },
        created:function () {
               this.usersListBase.push({"title":"Lets play mafia","description":"Its weekend coming, lets play :)","users":[{"email":"shgrover@microsoft.com","name":"Shakun grover"},{"email":"anshriv@microsoft.com","name":"Anubhav Shrivastava"}],"tags":["gaming"],"createdBy":{"email":"anshriv@microsoft.com","name":"Anubhav Shrivastava"},"scheduledOn":"29 Jul 2020 00:30:00 GMT","timeInMunutes":"60"});
               this.usersListBase.push({"title":"Chess anyone?","description":"Have been so long :(, lets play :)","users":[{"email":"ajays@microsoft.com","name":"Ajay Suri"}],"tags":["gaming"],"createdBy":{"email":"ajays@microsoft.com","name":"Ajay Suri"},"scheduledOn":"30 Jul 2020 00:30:00 GMT","timeInMunutes":"60"});
               this.usersListBase.push({"title":"Toastmasters","description":"Learn public speaking & shed your inhibitions","users":[{"email":"siddhant.bhatt@microsoft.com","name":"Siddhant Bhatt"}],"tags":["gaming"],"createdBy":{"email":"siddhant.bhatt@microsoft.com","name":"Siddhant Bhatt"},"scheduledOn":"29 Jul 2020 01:30:00 GMT","timeInMunutes":"60"});
               this.usersListBase.push({"title":"Pantry","description":"Lets catch up today","users":[{"email":"krishan.nagpal@microsoft.com","name":"Krishan Nagpal"}],"tags":["cofee"],"createdBy":{"email":"krishan.nagpal@microsoft.com","name":"Krishan Nagpal"},"scheduledOn":"29 Jul 2020 04:30:00 GMT","timeInMunutes":"600"});
 //              this.usersListBase.push({"title":"Chess anyone?","description":"Have been so long :(","users":["Ajay Suri"],"tags":["entertainment"],"createdBy":"Ajay Suri","scheduledOn":"30/07/20 10:10:15 - pm"});
 //              this.usersListBase.push({"title":"Toastmasters","description":"Learn public speaking & shed your inhibitions","users":["Siddhant Bhatt"],"tags":["public speaking"],"createdBy":"Siddhant Bhatt","scheduledOn":"01/08/20 01:10:15 - pm"});

console.log(this.usersListBase);
         this.search();
       
        }
    }
</script>