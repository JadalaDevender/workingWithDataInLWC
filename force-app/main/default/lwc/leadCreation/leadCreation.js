/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-dupe-class-members */
import { LightningElement,api,track} from 'lwc';
//import {getRecord,getFieldValue} from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
 
import Subject_FIELD from '@salesforce/schema/Task.Subject';
import ActivityDate_FIELD from '@salesforce/schema/Task.ActivityDate';
import { NavigationMixin } from 'lightning/navigation';
//import CallDurationInSeconds_FIELD from '@salesforce/schema/Task.CallDurationInSeconds';
//import Type_FIELD from '@salesforce/schema/Task.Type';
import Description_FIELD from '@salesforce/schema/Task.Description';
import Status_FIELD from '@salesforce/schema/Task.Status';
import Priority_FIELD from '@salesforce/schema/Task.Priority';
//import IsReminderSet_FIELD from '@salesforce/schema/Task.IsReminderSet';
import convertLead from '@salesforce/apex/leadConversion.convertLead';
 
 
export default class LeadCreation extends NavigationMixin(LightningElement) {
    @track error;
    @track selectRecordId;
    @track selectrecordname;
    @track hasValue=false;
    hastrue=true;
    hasfalse=false;
    @track showAttachTo=true;
 
    // this object have record information
    @track taskRecord = {
        Subject : Subject_FIELD,
        ActivityDate : ActivityDate_FIELD,
       // CallDurationInSeconds : CallDurationInSeconds_FIELD,
       
        Description : Description_FIELD,
        Status:Status_FIELD,
        Priority:Priority_FIELD,
        //IsReminderSet:IsReminderSet_FIELD,
       // convertLead:convertLead
 
    };
 
    @track sendEmailCheckbox;
    @api recordId;
    
    @api company;
    @api owner;
    @api LeadSource;
    //@track recordId;
    @track Task;
    @track oppName;
    accName;
    productid;
    accRecordId;
    donotcreateopp=false;
    selectedRec;
    
    get createOptions(){
        return[
        { label: 'Create New', value: 'CreateNew' },
        { label: 'Attach to exsisting Client/prospect', value: 'Existing' }
        ]
    }
 
       get options() {
        return [
            { label: 'Create New: Test Lead', value: 'New' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
        ];
    }
    get optionsStatus() {
        return [
            { label: 'Not Started', value: 'Not Started' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Deferred', value: 'Deferred' },
        ];
    }
    get optionsType1() {
        return [
            { label: 'Low', value: 'Low' },
            { label: 'Normal', value: 'Normal' },
            { label: 'High', value: 'High' },
        ];
    }
    get optionsSubject() {
        return [
            { label: 'Call', value: 'Call' },
            { label: 'Email', value: 'Email' },
            { label: 'Send Letter', value: 'Send Letter' },
            { label: 'Send Quote', value: 'Send Quote' },
        ];
    }
    get optionsType() {
        return [
            { label: 'Call', value: 'Call' },
            { label: 'Meeting', value: 'Meeting' },
            { label: 'Other', value: 'Other' },
            { label: 'Email', value: 'Email' },
        ];
    }
    
       
    openTask(){
        this.hasValue=this.hastrue;
    }
    checkSendEmail(event){
        this.sendEmailCheckbox=event.target.checked;
        
        if(event.target.name==='noOpp'){
            this.donotcreateopp=event.target.checked;
            
        }
 
    }
    convertL(){
        
        if(this.hasValue===false){
           this.taskRecord=null;
           
           
           }
        
        console.log(this.taskRecord);
        convertLead({'recordId':this.recordId,'sendEmailCheckbox':this.sendEmailcheckbox,'donotcreateopp':this.donotcreateopp,'ExistingAccount':this.selectedRec,
      'ProductId':this.productid,'oppName':this.oppName,'taskRec':this.taskRecord})
      
        
      .then(result => {
        // Clear the user enter values
        this.taskRecord = {};
        this.accRecordId=result;
 
        window.console.log('result ===> '+result);
        // Show success messsage
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.accRecordId,
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
       
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success!!',
            message: 'Lead Converted Successfully!!',
            variant: 'success'
        }),);
    })
    .catch(error => {
        this.error = error.message;
        
        console.log(this.error);
    });
 
  
      }
      selectedrecords(event){
        this.selectedRec = event.detail.currentRecId;
        
      }
      checkinput(event){
          if(event.target.name==='createOption'){
              this.accName=event.target.value;
          }
          if(event.target.name==='productid'){
              this.productid=event.target.value;
          }
          if(event.target.name==='opportunityName'){
              this.oppName=event.target.value;
              
          }
           
      }
      handleChange(event){
        if(event.target.name==='Subject'){
            this.taskRecord.Subject=event.target.value;
        }
        if(event.target.name==='ActivityDate'){
            this.taskRecord.ActivityDate=event.target.value;
        }
        if(event.target.name==='CallDurationInSeconds'){
            this.taskRecord.CallDurationInSeconds=event.target.value;
        }
        if(event.target.name==='Description'){
            this.taskRecord.Description=event.target.value;
        }
        if(event.target.name==='Status'){
            this.taskRecord.Status=event.target.value;
        }
        if(event.target.name==='Priority'){
            this.taskRecord.Priority=event.target.value;
        }
        if(event.target.name==='IsReminderSet'){
            this.taskRecord.IsReminderSet=event.target.value;
        }
        if(event.target.name==='CreateOption'){
         if(event.target.value==='CreateNew'){
             this.showAttachTo=this.hasfalse;
         }
         if(event.target.value==='Existing'){
            this.showAttachTo=this.hastrue;
        }
        }     
      }
    }
 