import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CheckoutFormService } from '../../services/checkout-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CheckoutValidators } from '../../validators/checkout-validators';
import { CartService } from '../../services/cart.service';

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
    private checkoutFormService: CheckoutFormService,
    private cartService: CartService
  ) {
    this.checkoutFormGroup = formBuilder.group({});
  }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutValidators.notOnlyWhitespace
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutValidators.notOnlyWhitespace
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
        ])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        address1: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutValidators.notOnlyWhitespace
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutValidators.notOnlyWhitespace
        ]),
        state: new FormControl('', [Validators.required]),
        zip: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutValidators.notOnlyWhitespace
        ]),
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        address1: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutValidators.notOnlyWhitespace
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutValidators.notOnlyWhitespace
        ]),
        state: new FormControl('', [Validators.required]),
        zip: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutValidators.notOnlyWhitespace
        ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutValidators.notOnlyWhitespace
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}')
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}')
        ]),
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
    
    if (this.checkoutFormGroup.invalid) {
      // touching all fields will trigger the display of all error messages
      this.checkoutFormGroup.markAllAsTouched();
    }
    
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

  reviewCartDetails() {

    // subscribe to cartService subjects
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
    });

    this.cartService.totalPrice.subscribe(data => {
      this.totalPrice = data;
    });

  }

  // getters -- customer form controls
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  // getters -- shipping address form controls
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.address1'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZip() { return this.checkoutFormGroup.get('shippingAddress.zip'); }

  // getters -- billing address form controls
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.address1'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZip() { return this.checkoutFormGroup.get('billingAddress.zip'); }

  // getters -- payment method
  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

}
