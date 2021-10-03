trigger addressUpdate on Contact (after insert,after update) {
	//List<ID> AccID = New List<ID>();
	Map<id, contact> cont = new Map<id, contact>();
    system.debug('---'+Trigger.new);
    if((Trigger.isInsert || Trigger.isUpdate) && Trigger.isAfter){
    	for(Contact con : Trigger.new){
            if(con.MailingCity != null && con.AccountId != null){
                system.debug('--con--'+con);
                //AccID.add(con.AccountId);
                cont.put(con.AccountId, con);
            }
        }
    	system.debug('--cont--'+cont);
        //List<Contact> conlist = [ select mailingCity from Contact where accountId in :AccID];
        List<Account> accList = new List<Account>();
        for(Account a : [SELECT Name, BillingStreet,BillingCity FROM Account WHERE id in :cont.keySet()]){
            //String address = ''+ conlist[0].get('mailingcity');
            system.debug('--a--'+a);
            a.BillingCity = cont.get(a.Id).MailingCity;
            accList.add(a);
        }
        update accList;
    }
	
}