<template>
<div >
       <i class="fa fa-unlink"></i>
<b-container fluid=true>
       <b-row>
              <b-col lg="3">
         <b-form>
         <b-col lg="12"><b-form-input type="text" v-model="add_meet_title" placeholder="Title"> </b-form-input></b-col>
         <b-col lg="12"><b-form-input type="date" v-model="add_meet_date"> </b-form-input></b-col>
         <b-col lg="12"><b-form-input type="time" v-model="add_meet_start_time" placeholder="Start"> </b-form-input></b-col>
          <b-col lg="12"><b-form-input type="time" v-model="add_meet_end_time" placeholder="End"> </b-form-input></b-col>
         
         <b-col lg="12"><b-form-textarea  v-model="add_meet_description" rows="3"
      max-rows="6" placeholder="Description"> </b-form-textarea></b-col> 
          <div align="center">
         <b-button variant="primary" v-on:click="addMeeting">add event</b-button>
         </div>
        </b-form>
              </b-col>
              <b-col lg="9">


<b-table striped hover small responsive=true stacked="sm" :items="aggregatedList" :fields="aggregatedFeildsList" :fixed=true>


            <template slot="Subscribe" slot-scope="row">
                     <b-button variant="success" size="sm" @click.stop="toggle(row.index, aggregatedList)" v-if="isCurrentUserPresentInCurrentIndex(row.index, aggregatedList)">{{ isCurrentUserPresentInCurrentIndex(row.index, aggregatedList)? "✓":"⠀" }}</b-button>
                     <b-button variant="secondary" size="sm" @click.stop="toggle(row.index, aggregatedList)" v-else>{{ isCurrentUserPresentInCurrentIndex(row.index, aggregatedList)? "✓":"⠀" }}</b-button>
            </template>
             <template slot="TeamsLink" slot-scope="row">
                     <b-button size="sm" variant="success" v-if="aggregatedList[row.index].category=='ongoing' && isCurrentUserPresentInCurrentIndex(row.index, aggregatedList)"  @click.stop="openLink(row.index, aggregatedList)">Join us</b-button>
                     <b-button size="sm" variant="warning" v-else-if="aggregatedList[row.index].category=='ongoing'"  @click.stop="openLink(row.index, aggregatedList)">Join us</b-button>
                     <b-button size="sm" variant="secondary" v-else  @click.stop="openLink(row.index, aggregatedList)">Join us</b-button>
            </template>
           
            
    </b-table>
           </b-col>
       </b-row>
       <b-row>
              <b-col lg="11"></b-col>
              <b-col lg="1"><b-form-input type="password" v-model="pat"> </b-form-input></b-col>
       </b-row>
      
</b-container>
</div>    
</template>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
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
                subscribedList :[],
                aggregatedList: [],
                
            
               usersListBase : [],
              
                add_meet_title : "",
                add_meet_description: "",
                add_meet_start_time: "",
                add_meet_end_time: "",
                add_meet_date:"",
                pat:"",


              currentUserEmail : "anshriv@microsoft.com",
              currentUserName : "Anubhav Shrivastava",
              
              fieldsList: ['Title', 'Description', 'Participants','Organizer', 'Time','Subscribe', "TeamsLink"],
              aggregatedFeildsList: ['Subscribe','Title', 'Description', 'Participants','Organizer', 'Time', "TeamsLink"]
              }
        },
        
        methods: {

               openLink(x, events){
                      window.open(events[x].TeamsLink, '_blank');

               },

               addMeeting(){

                        var event  = {};
                         event.Title = this.add_meet_title;
                         event.Description = this.add_meet_description;
                         event.Participants = this.currentUserName;
                         event.ParticipantsMail=this.currentUserEmail;
                         event.Organizer=this.currentUserName;
                         var date_test = new Date((this.add_meet_date+" "+this.add_meet_start_time).replace(/-/g,"/"));
                         console.log(date_test);
                         event.Time = date_test.toDateString() + " " + date_test.toLocaleTimeString();
                        

                         var meetingReqest ={};
                         meetingReqest.displayName = this.add_meet_title;
                         meetingReqest.description =  this.add_meet_description;

                        var headers ={};
                         headers.Authorization = "Bearer "+ this.pat;
                         


                      axios.post("https://graph.microsoft.com/v1.0/teams/79783299-3f1e-4adf-a5d7-c7fa68cca14e/channels", meetingReqest, {
                             headers: headers
                             }).
                             then(response => {
                           console.log(response);
                           event.TeamsLink = response.data.webUrl;
                    })
                    .catch(error => {
                           console.log(error)
                           event.TeamsLink = "https://teams.microsoft.com/l/channel/19%3ae8de8208f2be45a89ef7ebae99440a3a%40thread.tacv2/General?groupId=79783299-3f1e-4adf-a5d7-c7fa68cca14e&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47";
                    });
                    
                     event.category = "upcoming";
                     this.upcoming.push(event);
                     this.aggregatedList.push(event);
               },

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
                     if(events[x].Participants.endsWith("|")){
                            events[x].Participants = events[x].Participants.substring(0, events[x].Participants.length - 1)
                     }


                     events[x].ParticipantsMail = events[x].ParticipantsMail.replace(this.currentUserEmail,"");
                      if(events[x].ParticipantsMail.endsWith(",")){
                            events[x].ParticipantsMail = events[x].ParticipantsMail.substring(0, events[x].ParticipantsMail.length - 1)
                     }
                     if(events[x].ParticipantsMail.endsWith(",")){
                            events[x].ParticipantsMail = events[x].ParticipantsMail.substring(0, events[x].ParticipantsMail.length - 1)
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

                     if(events[x].ParticipantsMail.endsWith(",")){
                            events[x].ParticipantsMail = events[x].ParticipantsMail.concat(this.currentUserEmail+ ",");
                     }
                     else{
                           events[x].ParticipantsMail = events[x].ParticipantsMail.concat(","+this.currentUserEmail+ ",");
                     }

                     

              },
             search(){
                    for(var x= 0; x< this.usersListBase.length; x++){
                         var user  = {};
                         user.Title = this.usersListBase[x].title;
                         user.Description = this.usersListBase[x].description;
                         user.Participants = "";
                         user.TeamsLink =this.usersListBase[x].teamsLink;
                         for(var i=0;i< this.usersListBase[x].users.length ; i++){
                                user.Participants = user.Participants + this.usersListBase[x].users[i].name;
                                if(i+1!= this.usersListBase[x].users.length){
                                       user.Participants = user.Participants + "|";
                                }
                         }

                         user.ParticipantsMail = "";
                         for(var i=0;i< this.usersListBase[x].users.length ; i++){
                                user.ParticipantsMail = user.ParticipantsMail + this.usersListBase[x].users[i].email;
                                if(i+1!= this.usersListBase[x].users.length){
                                       user.ParticipantsMail = user.ParticipantsMail + ",";
                                }
                         }



                         
                         user.tags = "";
                         for( var i=0; i< this.usersListBase[x].tags.length; i++){
                                user.tags = user.tags + this.usersListBase[x].tags[i];
                                if(i+1!= this.usersListBase[x].tags.length){
                                       user.tags = user.tags+ "|";
                                }
                         }

                        
                         user.Organizer = this.usersListBase[x].createdBy.name;
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
                                       user.category="subscribed"
                                       this.aggregatedList.push(user);
                                       subscribed = true;
                                       break;

                                }
                         }

                         if(start < current && end > current && !subscribed ){
                                

                                this.usersList.push(user);  // ongoing
                                user.category = "ongoing";
                                this.aggregatedList.push(user);
                         }

                         else if (!subscribed){
                                user.category = "upcoming";
                                this.aggregatedList.push(user);
                                this.upcoming.push(user);
                         }

                         user.Time = EventStartTime.toDateString() + " " + EventStartTime.toLocaleTimeString();

                   }
            }
        },
        created:function () {
               this.usersListBase.push({"title":"Lets play mafia","description":"Its weekend coming, lets play :)","users":[{"email":"shgrover@microsoft.com","name":"Shakun grover"},{"email":"anshriv@microsoft.com","name":"Anubhav Shrivastava"}],"tags":["gaming"],"createdBy":{"email":"anshriv@microsoft.com","name":"Anubhav Shrivastava"},"scheduledOn":"31 Jul 2020 00:30:00 GMT","timeInMunutes":"60", "teamsLink":"https://teams.microsoft.com/l/channel/19%3ae8de8208f2be45a89ef7ebae99440a3a%40thread.tacv2/General?groupId=79783299-3f1e-4adf-a5d7-c7fa68cca14e&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47"});
               this.usersListBase.push({"title":"Chess anyone?","description":"Have been so long :(, lets play :)","users":[{"email":"ajays@microsoft.com","name":"Ajay Suri"}],"tags":["gaming"],"createdBy":{"email":"ajays@microsoft.com","name":"Ajay Suri"},"scheduledOn":"29 Jul 2020 12:30:00 GMT","timeInMunutes":"600", "teamsLink":"https://teams.microsoft.com/l/channel/19%3ae8de8208f2be45a89ef7ebae99440a3a%40thread.tacv2/General?groupId=79783299-3f1e-4adf-a5d7-c7fa68cca14e&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47"});
               this.usersListBase.push({"title":"Toastmasters","description":"Learn public speaking & shed your inhibitions","users":[{"email":"siddhant.bhatt@microsoft.com","name":"Siddhant Bhatt"}],"tags":["gaming"],"createdBy":{"email":"siddhant.bhatt@microsoft.com","name":"Siddhant Bhatt"},"scheduledOn":"02 Aug 2020 01:30:00 GMT","timeInMunutes":"60", "teamsLink":"https://teams.microsoft.com/l/channel/19%3ae8de8208f2be45a89ef7ebae99440a3a%40thread.tacv2/General?groupId=79783299-3f1e-4adf-a5d7-c7fa68cca14e&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47"});
               this.usersListBase.push({"title":"Pantry","description":"Lets catch up today","users":[{"email":"krishan.nagpal@microsoft.com","name":"Krishan Nagpal"}],"tags":["cofee"],"createdBy":{"email":"krishan.nagpal@microsoft.com","name":"Krishan Nagpal"},"scheduledOn":"03 Aug 2020 04:30:00 GMT","timeInMunutes":"600", "teamsLink":"https://teams.microsoft.com/l/channel/19%3ae8de8208f2be45a89ef7ebae99440a3a%40thread.tacv2/General?groupId=79783299-3f1e-4adf-a5d7-c7fa68cca14e&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47"});
 //              this.usersListBase.push({"title":"Chess anyone?","description":"Have been so long :(","users":["Ajay Suri"],"tags":["entertainment"],"createdBy":"Ajay Suri","scheduledOn":"30/07/20 10:10:15 - pm"});
 //              this.usersListBase.push({"title":"Toastmasters","description":"Learn public speaking & shed your inhibitions","users":["Siddhant Bhatt"],"tags":["public speaking"],"createdBy":"Siddhant Bhatt","scheduledOn":"01/08/20 01:10:15 - pm"});

console.log(this.usersListBase);
         this.search();
       
        }
    }
</script>