import { Component, OnInit } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { SeoService } from 'src/app/services/seo.service';
import { Customer } from '../customer.model';
import { CustomersService } from '../customers.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
})
export class ListPageComponent implements OnInit {
  customers: Observable<Customer[]>;

  constructor(private seo: SeoService, private customersService: CustomersService) {}

  ngOnInit() {
    this.seo.generateTags({
      title: 'Customer List',
      description: 'A list filled with customers',
    });

    this.customers = this.customersService.getAllCustomers();

    this.customers.subscribe((data) => console.warn(data));
  }
}
