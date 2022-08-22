import { LightningElement, wire, track, api } from 'lwc';
import getinvoiceRelaredList from '@salesforce/apex/InvoiceRelatedListController.getinvoiceRelaredList';
import Status from '@salesforce/schema/Case.Status';
const COLUMNS = [
    { label: 'Invoice Number', fieldName: 'invName', type: 'url', typeAttributes: {label: { fieldName: 'Name' }, target: '_blank' }},
    { label: 'Invoice Date', fieldName: 'Invoice_Date__c', type: 'Date' },
    { label: 'Due Date', fieldName: 'Due_Date__c', type: 'Date'},
    { label: 'Amount Due', fieldName: 'Amount_Due__c', type: 'currency' },
    { label: 'Amount Paid', fieldName: 'Amount_Paid__c', type: 'currency'},
    { label: 'Status', fieldName: 'Status__c', type: 'text'},
    { label: 'Total', fieldName: 'Total__c', type: 'currency'}
];
export default class InvoiceRelatedList extends LightningElement 
{
    listofInvoices = [];
    @api recordId;
    columns = COLUMNS;
    @wire(getinvoiceRelaredList,{accountId:'$recordId'})
    invoices({ error, data }) {

        if (data) {
            console.log('Number of invoices'+data.length);
            let tempInvoiceList = []; 
            data.forEach((record) => {
                let tempInvoiceRec = Object.assign({}, record);  
                tempInvoiceRec.invName = '/' + tempInvoiceRec.Id;
                tempInvoiceList.push(tempInvoiceRec);
            });
            this.listofInvoices = tempInvoiceList;
            this.error = undefined;

            console.table(this.listofInvoices);

        } else if (error) {
            this.error = result.error;
        }
    }
}
