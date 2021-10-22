public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getOpps( String searchKey, String sortBy, String sortDirection) {
       
        String query = 'SELECT Id, Name,Account.Name,Email,Phone,Title,Owner.Name FROM Contact';
        system.debug('query---'+query);
        if ( searchKey != null && searchKey != '' ) {
            String key = '%' + searchKey + '%';
            query += ' WHERE Name LIKE :key';
        }
        if ( sortBy != null && sortDirection != null ) {
            query += ' ORDER BY ' + sortBy + ' ' + sortDirection;
        }
        return Database.query( query );
    }
}
@track error;
    @track data;
    result;
    @track data = []; 
    @track columns; 
    
    @wire(taskLists)
    wiredAccounts({ error, data })
    {
        if (data)
        {
            let currentData = [];

        data.forEach((row) => {

            let rowData = {}; //records are stored into rowData

                rowData.Subject = row.Subject;
                rowData.Priority = row.Priority;
                rowData.Status = row.Status;
                rowData.ActivityDate = row.ActivityDate;
           
            if (row.Contact) {
                rowData.WhoId = row.Contact.Name;
                //rowData.AccountOwner = row.Account.Owner.Name;
            }
            // Owner releated data
            if (row.Owner) {
                rowData.OwnerId = row.Owner.Name;
          }

            currentData.push(rowData);//row data stored into currentData
        });

        this.data = currentData;
        this.columns = columns;
        } 
        else if (error) 
        {
            this.error = error;
            this.data = undefined;
        }
    }
}
