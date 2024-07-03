import { FormControl, ValidationErrors } from "@angular/forms";

export class CheckoutValidators {

    // whitespace vaclidation
    static notOnlyWhitespace(control: FormControl): ValidationErrors | null {

        // check if string only has whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {
            return { "notOnlyWhitespace": true };
        }

        return null;
    }

}
