import { LightningElement, wire, track, api } from 'lwc';
import getinvoiceRelatedList from '@salesforce/apex/InvoiceRelatedListController.getinvoiceRelatedList';
import totalPaidInvoices from '@salesforce/apex/InvoiceRelatedListController.totalPaidInvoices';
import totalDueInvoices from '@salesforce/apex/InvoiceRelatedListController.totalDueInvoices';
import totalReceivablesAmount from '@salesforce/apex/InvoiceRelatedListController.totalReceivablesAmount';
import totalOverdueInvoices from '@salesforce/apex/InvoiceRelatedListController.totalOverdueInvoices';
const COLUMNS = [
    { label: 'Invoice Number', fieldName: 'invName', type: 'url', typeAttributes: {label: { fieldName: 'Name' }, target: '_blank' }},
    { label: 'Invoice Date', fieldName: 'Invoice_Date__c', type: 'Date' },
    { label: 'Due Date', fieldName: 'Due_Date__c', type: 'Date'},
    { label: 'Amount Due', fieldName: 'Amount_Due__c', type: 'currency' },
    { label: 'Amount Paid', fieldName: 'Amount_Paid__c', type: 'currency'},
    { label: 'Status', fieldName: 'Status__c', type: 'text'},
    { label: 'Total', fieldName: 'Total__c', type: 'currency'},
    { label: 'Days Overdue', fieldName: 'Days_Overdue__c', type: 'number'}
];
export default class InvoiceRelatedList extends LightningElement 
{
    listofInvoices = [];
    overduedata = [];
    overdue1_30 = 0;
    overdue31_60 = 0;
    overdue61_90 = 0;
    overdue90 = 0;
    totalOverdue = 0;
    @api recordId;
    columns = COLUMNS;
    @wire(getinvoiceRelatedList,{accountId:'$recordId'})
    invoices({ error, data }) 
    {
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
    @wire(totalPaidInvoices,{accountId:'$recordId'})paidInvoices;
    @wire(totalDueInvoices,{accountId:'$recordId'})dueInvoices;
    @wire(totalReceivablesAmount,{accountId:'$recordId'})totalReceivables;
    @wire(totalOverdueInvoices,{accountId:'$recordId'})
    overdue({ error, data })
    {
        if(data)
        {
            console.log("entered");
            this.overduedata = data;
            this.totalOverdue = this.overduedata.length;
            for(let i=0; i<this.overduedata.length; i++)   
       {
         if(this.overduedata[i].Days_Overdue__c >=1 && this.overduedata[i].Days_Overdue__c <= 30)
         {
                this.overdue1_30 = this.overdue1_30 + 1;
         }
         else if(this.overduedata[i].Days_Overdue__c >=31 && this.overduedata[i].Days_Overdue__c <= 60)
         {
            this.overdue31_60 = this.overdue31_60 + 1;
         }
         else if(this.overduedata[i].Days_Overdue__c >=61 && this.overduedata[i].Days_Overdue__c <= 90)
         {
            this.overdue61_90 = this.overdue61_90 + 1;
         }
         else if(this.overduedata[i].Days_Overdue__c >=91)
         {
            this.overdue90 = this.overdue90 + 1;
         }
       }
        }
    }
}
