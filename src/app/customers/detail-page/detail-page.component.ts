import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { SeoService } from 'src/app/services/seo.service';
import { Customer } from '../customer.model';
import { CustomersService } from '../customers.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
})
export class DetailPageComponent implements OnInit {
  customerId: string;
  customer: Observable<Customer>;

  constructor(
    private route: ActivatedRoute,
    private customersService: CustomersService,
    private seo: SeoService
  ) {}

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('id');

    this.customer = this.customersService.getCustomersById(this.customerId).pipe(
      tap((customer) =>
        this.seo.generateTags({
          title: customer.name,
          description: customer.bio,
          image: customer.image,
        })
      )
    );
  }
}
