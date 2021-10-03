import { LightningElement, wire, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOpps from '@salesforce/apex/OpportunityController.getOpps';
import Id from '@salesforce/user/Id';
import UserRoleId from '@salesforce/schema/User.UserRoleId';
const columns = [{
        label: 'Name',
        fieldName: 'Name',
        type: 'text',
        sortable: true
    },
    {
    label: 'Account Name',
        fieldName: 'AccountName',
        type: 'text',
        sortable: true
    },
    {
        label: 'Email',
        fieldName: 'Email',
        type: 'email',
        sortable: true
    },
    {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone',
        sortable: true
    },
    {
        label: 'Title',
        fieldName: 'Title',
        type: 'Picklist',
        sortable: true
    },
    {
    label: 'Owner Name',
        fieldName: 'OwnerName',
        type: 'text',
        sortable: true
    }
];

export default class pagination extends LightningElement {
    @track value;
    @track error;
    @track data;
    @api sortedDirection = 'asc';
    @api sortedBy = 'Name';
    @api searchKey = '';
    result;
    
    @track page = 1; 
    @track items = []; 
    @track data = []; 
    @track columns; 
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 5; 
    @track totalRecountCount = 0;
    @track totalPage = 0;
    
    @wire(getOpps, {searchKey: '$searchKey', sortBy: '$sortedBy', sortDirection: '$sortedDirection'})
    wiredAccounts({ error, data }) {
        if (data)
        {
            let currentData = [];

        data.forEach((row) => {

            let rowData = {}; //records are stored into rowData

                rowData.Name = row.Name;
                rowData.Email = row.Email;
                rowData.Title = row.Title;
                rowData.Phone = row.Phone;
            // Account related data
            if (row.Account) {
                rowData.AccountName = row.Account.Name;
                //rowData.AccountOwner = row.Account.Owner.Name;
            }

            // Owner releated data
            if (row.Owner) {
                rowData.OwnerName = row.Owner.Name;
          }

            currentData.push(rowData);//row data stored into currentData
        });

        //this.data = currentData;
        
            this.items = currentData;// current data stored to items
            this.totalRecountCount = data.length; //it will recount the pages
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            
            this.data = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.columns = columns;

            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }
    

    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }

    //this method displays records page by page
    displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.data = this.items.slice(this.startingRecord, this.endingRecord);

        this.startingRecord = this.startingRecord + 1;
    }    
    
    sortColumns( event ) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        return refreshApex(this.result);
        
    }
  
    handleKeyChange( event ) {
        this.searchKey = event.target.value;
        return refreshApex(this.result);
    }

}