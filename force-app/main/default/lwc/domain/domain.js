import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { reduceErrors } from 'c/ldsUtils';
import NAME_FIELD from '@salesforce/schema/Manage_Domains__c.Name';
import DOMAIN_FIELD from '@salesforce/schema/Manage_Domains__c.Domain__c';
import THIRD_PARTY_DOMAIN_FIELD from '@salesforce/schema/Manage_Domains__c.Third_Party_Domain__c';
import domainList from '@salesforce/apex/DomainController.domainList';
import DOMAIN_OBJECT from '@salesforce/schema/Manage_Domains__c';
const actions = [
    { label: 'Delete', name: 'delete' },
];
const COLUMNS = [
    { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text'},
    { label: 'Domain', fieldName: DOMAIN_FIELD.fieldApiName, type: 'url' },
    { label: 'Third Party Domain', fieldName: THIRD_PARTY_DOMAIN_FIELD.fieldApiName, type: 'Boolean' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];
export default class Domain extends LightningElement {
    columns = COLUMNS;
    @wire(domainList)
    domains;
    @api reccordId;
    result;
    isFormVisible = false;
    get errors() {
        return (this.domains.error) ?
            reduceErrors(this.domains.error) : [];
    }
    objectApiName = DOMAIN_OBJECT;
    fields = [NAME_FIELD, DOMAIN_FIELD, THIRD_PARTY_DOMAIN_FIELD];
    handleSuccess(event) {
        const toastEvent = new ShowToastEvent({
            title: "Domain created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
        this.isFormVisible=false;
        return refreshApex(this.domains);
    }
    handleRowAction( event ) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch ( actionName ) {
            case'delete':
               this.recordId = event.target.value;
               deleteRecord(row.Id) 
               .then(() =>{
                  const toastEvent = new ShowToastEvent({
                      title:'Record Deleted',
                      message:'Record deleted successfully',
                      variant:'success',
                  })
                  this.dispatchEvent(toastEvent);
                  refreshApex(this.domains); 
               })
               .catch(error =>{
                   window.console.log('Unable to delete record due to ' + error.body.message);
               });
               break;
            default:
        }
      }
     handleClick(event) {
        this.isFormVisible = event.target.title;
    }  
}