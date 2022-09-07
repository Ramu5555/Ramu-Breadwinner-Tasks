import { LightningElement, wire, track, api } from 'lwc';
import getinvoiceRelatedList from '@salesforce/apex/InvoiceRelatedListController.getinvoiceRelatedList';
import invoiceSummaryInformation from '@salesforce/apex/InvoiceRelatedListController.invoiceSummaryInformation';
import totalOverdueInvoices from '@salesforce/apex/InvoiceRelatedListController.totalOverdueInvoices';
const COLUMNS = [
    { label: 'Invoice Number', fieldName: 'invName', type: 'url', typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'},sortable: "true" },
    { label: 'Invoice Date', fieldName: 'Invoice_Date__c', type: 'date' ,sortable: "true",typeAttributes: {day: "numeric", month: "numeric", year: "numeric"}},
    { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date',sortable: "true",typeAttributes: {day: "numeric", month: "numeric", year: "numeric"}},
    { label: 'Amount Due', fieldName: 'Amount_Due__c', type: 'currency',sortable: "true" },
    { label: 'Amount Paid', fieldName: 'Amount_Paid__c', type: 'currency',sortable: "true" },
    { label: 'Status', fieldName: '', cellAttributes: { iconName: { fieldName: 'Status__c' }, class: { fieldName: 'icon' }}},
    { label: 'Total', fieldName: 'Total__c', type: 'currency',sortable: "true"},
    { label: 'Days Overdue', fieldName: 'Days_Overdue__c', type: 'number',sortable: "true"}
];
export default class InvoiceRelatedList extends LightningElement 
{
    @track data;
    @track columns = COLUMNS;
    @track sortBy='Name';
    @track sortDirection='asc';
    overduedata = [];
    overdue1_30 = 0;
    overdue31_60 = 0;
    overdue61_90 = 0;
    overdue90 = 0;
    totalOverdue = 0;
    summaryInformation = [];
    @track result;
    @api recordId;
    @api isLoading = false;
    @wire(getinvoiceRelatedList,{accountId:'$recordId',field : '$sortBy',sortOrder : '$sortDirection'})
    invoices({ error, data }) 
    {
        if (data) {
            this.isLoading = false;
            let invoiceList = []; 
            data.forEach((record) => {
                let invoiceRec = Object.assign({}, record);  
                invoiceRec.invName = '/' + invoiceRec.Id;
                invoiceList.push(invoiceRec);
            });
            this.data = invoiceList;
            this.error = undefined;
            console.table(this.data);
            invoiceList.forEach(inv => {
                if(inv.Status__c.includes("Paid")){
                    inv.Status__c='action:goal';
                    inv.icon='slds-icon slds-icon-text-success';
                }else if(inv.Status__c.includes("Overdue"))
                {
                    inv.Status__c='action:goal';
                    inv.icon='slds-icon slds-icon-text-error';
                }
                else{
                    inv.Status__c='action:goal';
                    inv.icon='slds-icon slds-icon-text-warning';
                }
            });

        } else if (error) {
            this.error = result.error;
        }
    }
    doSorting(event) 
    {
        this.isLoading = true;
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
    }
    @wire(invoiceSummaryInformation,{accountId:'$recordId'})
    paidInv({ error, data })
    {
        if(data)
        {
            this.summaryInformation = data;
        }
    }
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
         else if (error) {
            this.error = result.error;
        }
       }
        }
    }
}
