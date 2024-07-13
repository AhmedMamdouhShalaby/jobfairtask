import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HC_exporting from 'highcharts/modules/exporting';
import HC_stock from 'highcharts/modules/stock';
import HC_map from 'highcharts/modules/map';
import HC_gantt from 'highcharts/modules/gantt';

// Initialize the modules
HighchartsMore(Highcharts);
HC_exporting(Highcharts);
HC_stock(Highcharts);
HC_map(Highcharts);
HC_gantt(Highcharts);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private _ServicesService: ServicesService) { }

  lineChart!: Chart;
  customers: any[] = [];
  transactions: any[] = [];
  amount: { [key: string]: number } = {};
  searchTerm: string = '';
  showLineChart: boolean = false;

  initializeChart(data: [number, number][], name: string): void {
    this.lineChart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: `${name} Transactions`
      },
      credits: {
        enabled: true
      },
      series: [
        {
          name: `${name} Transactions`,
          data: data
        } as Highcharts.SeriesLineOptions
      ],
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Transaction Amount'
        }
      }
    });
  }

  get(id: string, name: string): void {
    const customerTransactions = this.transactions.filter(transaction => transaction.customer_id === id);

    const data: [number, number][] = customerTransactions.map(transaction => [
      new Date(transaction.date).getTime(),
      transaction.amount
    ]);

    this.initializeChart(data, name);
    this.showLineChart = true;
  }

  ngOnInit(): void {
    console.log("Ahmed");

    this._ServicesService.GetUsersData().subscribe({
      next: (response) => {
        this.customers = response.record.customers;
        this.transactions = response.record.transactions;
        console.log('Full Response', response);
        this.calcTotalAmount();
      },
      error: (error) => {
        console.log('Error', error);
      }
    });
  }

  calcTotalAmount(): void {
    this.transactions.forEach(transaction => {
      const customerId = transaction.customer_id;
      if (!this.amount[customerId]) {
        this.amount[customerId] = 0;
      }
      this.amount[customerId] += transaction.amount;
    });

    this.customers = this.customers.map(customer => {
      return {
        ...customer,
        totalAmount: this.amount[customer.id] || 0
      };
    });

    console.log('Customers with Total Amount', this.customers);
  }
}
