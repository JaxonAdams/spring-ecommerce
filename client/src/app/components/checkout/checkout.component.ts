import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CheckoutFormService } from '../../services/checkout-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private checkoutFormService: CheckoutFormService
  ) {
    this.checkoutFormGroup = formBuilder.group({});
  }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        address1: [''],
        city: [''],
        state: [''],
        zip: [''],
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        address1: [''],
        city: [''],
        state: [''],
        zip: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;

    // poplulate credit card expiration months/years
    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(data => {
      this.creditCardMonths = data;
    });

    this.checkoutFormService.getCreditCardYears().subscribe(data => {
      this.creditCardYears = data;
    });

    // populate countries
    this.checkoutFormService.getCountries().subscribe(data => {
      this.countries = data;
    });

  }

  submit() {

    console.log("Handling form submission!");
    console.log("~~ Customer ~~");
    console.log(this.checkoutFormGroup.get('customer')?.value);

    console.log("~~ Shipping Address ~~");
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);

    console.log("~~ Billing Address ~~");
    console.log(this.checkoutFormGroup.get('billingAddress')?.value);

    console.log("~~ Payment Method ~~");
    console.log(this.checkoutFormGroup.get('creditCard')?.value);
    
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;

    this.checkoutFormService.getStates(countryCode).subscribe(data => {
      
      if (formGroupName === "shippingAddress") {
        this.shippingAddressStates = data;
      } else if (formGroupName === "billingAddress") {
        this.billingAddressStates = data;
      }

      // select first item by default
      formGroup?.get('state')?.setValue(data[0]);

    });

  }

  copyShippingAddressToBillingAddress(event: any) {
    
    if (event.target.checked) {

      console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
      console.log(this.checkoutFormGroup.get('billingAddress')?.value);

      this.checkoutFormGroup.controls['billingAddress']
          .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

    } else {

      this.checkoutFormGroup.controls['billingAddress'].reset();
      
    }
    
  }

  handleMonthsAndYears() {
    
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;
    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(data => {
      this.creditCardMonths = data;
    });

  }

}
