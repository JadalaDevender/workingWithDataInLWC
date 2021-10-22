public class leadConversion {
    @auraEnabled
    Public static Id convertLead(Id recordId,string sendEmailCheckbox,boolean donotcreateopp,Id ExistingAccount,string productId,String oppName,Task taskRec){
        system.debug('---'+taskRec);
        system.debug('---'+oppName);
        system.debug('---'+ExistingAccount);
        system.debug('---'+donotcreateopp);
        Database.LeadConvert lc=new Database.LeadConvert();
        lc.setLeadId(recordId);
        if(ExistingAccount!=null){
            lc.setAccountId(ExistingAccount);
            }
        if(sendEmailCheckbox=='options'){
            lc.setSendNotificationEmail(true);  
        }
        if(donotcreateopp){
            lc.setDoNotCreateOpportunity(true);
        }
        else{
            System.debug('--->'+oppName);
            lc.setOpportunityName(oppName);
        }
        leadstatus ls=[select id,MasterLabel,IsConverted from LeadStatus where IsConverted=true limit 1];
        
        lc.setConvertedStatus(ls.MasterLabel);
          
        Database.LeadConvertResult lcr=Database.convertLead(lc);
        id accid=lcr.getAccountId();
        Id conid=lcr.getContactId();
        Id oppId=lcr.getOpportunityId();
        
        try{
          
            if(taskRec!=null){
                taskRec.whoId=conid;
             taskRec.whatId=oppid;
        insert taskRec;
            }
            system.debug('id---'+taskRec);
        }
        catch(Exception ex) {
            System.debug('test'+ex.getMessage());
           throw new AuraHandledException(ex.getMessage());
        }
        return accid;
              
    }
    @auraEnabled
    Public static Lead getLeadInformation(Id recordId){
        
        Lead IsLead=[Select Id,Company,LeadSource,owner.Name from lead where Id=:recordId];
        return IsLead;
    }
    @auraEnabled
    Public static Id CreateTask(Id recordId,Task taskRec,Id ownerId){
        
       try{
          
            if(taskRec!=null){
                taskRec.WhatId=recordId;
                taskRec.ownerId=ownerId;
             
        insert taskRec;
            }
            system.debug('id---'+taskRec);
        }
        catch(Exception ex) {
            System.debug('test'+ex.getMessage());
           throw new AuraHandledException(ex.getMessage());
        }
        return taskRec.Id;
    }
     @auraEnabled
    Public static Account getAccountInformation(Id recordId){
        
        Account IsAccount=[Select Id,Name,Type,phone,(select Id,Name from opportunities),(Select Id,Name from contacts) from Account where Id=:recordId];
        return IsAccount;
    }
    @AuraEnabled(cacheable=true)
    public static List<SObJectResult> getResults(String ObjectName, String fieldName, String value) {
        List<SObJectResult> sObjectResultList = new List<SObJectResult>();
        system.debug(fieldName+'-------------'+ObjectName+'---++----------'+value);
        if(String.isNotEmpty(value))
            for(sObject so : Database.Query('Select Id,'+fieldName+' FROM '+ObjectName+' WHERE '+fieldName+' LIKE \'%' + value + '%\'')) {
                String fieldvalue = (String)so.get(fieldName);
                sObjectResultList.add(new SObjectResult(fieldvalue, so.Id));
            }
        
        return sObjectResultList;
    }
    
    public class SObJectResult {
        @AuraEnabled
        public String recName;
        @AuraEnabled
        public Id recId;
        
        public SObJectResult(String recNameTemp, Id recIdTemp) {
            recName = recNameTemp;
            recId = recIdTemp;
        }
    }
 
}
 