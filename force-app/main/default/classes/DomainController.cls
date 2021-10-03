public with sharing class DomainController {
    @AuraEnabled(cacheable=true)
    public static List<Manage_Domains__c> domainList() {
        return [
            SELECT Id,Name, Domain__c, Third_Party_Domain__c
            FROM Manage_Domains__c
            WITH SECURITY_ENFORCED
        ];
        //throw new AuraHandledException('Forced error');
    }
}





