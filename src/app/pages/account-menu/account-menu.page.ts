import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, Logger } from 'aws-amplify';
import { ICognitoUserAttributes, SessionService } from '@mawhea/ngx-core';

const logger = new Logger(`AccountMenuPage`);

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.page.html',
  styleUrls: ['./account-menu.page.scss']
})
export class AccountMenuPage implements OnInit {
  public formGroup: FormGroup;
  public user: any;
  public isSaving: boolean;

  constructor(
    private session: SessionService
  ) {
    this.formGroup = new FormGroup({
      imageUri: new FormControl(
        null, {
          updateOn: `change`,
          validators: []
        }
      ),
      email: new FormControl(null, {
        updateOn: 'change',
        validators: [
          Validators.required,
          Validators.email
        ]
      }),
      phoneNumber: new FormControl(null, {
        updateOn: 'change',
        validators: []
      }),
      givenName: new FormControl(null, {
        updateOn: 'change',
        validators: [
          Validators.required
        ]
      }),
      middleName: new FormControl(null, {
        updateOn: 'change',
        validators: []
      }),
      familyName: new FormControl(null, {
        updateOn: 'change',
        validators: [
          Validators.required
        ]
      }),
      birthdate: new FormControl(null, {
        updateOn: 'change',
        validators: [
          Validators.required
        ]
      })
    });
  }

  async ngOnInit() {
    try {
      logger.debug(`ngOnInit()`, `Auth.currentAuthenticatedUser()`);
      this.user = await Auth.currentAuthenticatedUser();
      // this.attributes = this.user.attributes;
      const {
        picture: imageUri = null,
        email = null,
        phone_number: phoneNumber = null,
        given_name: givenName = null,
        middle_name: middleName = null,
        family_name: familyName = null,
        birthdate = null
      } = this.user.attributes as ICognitoUserAttributes;
      this.formGroup.setValue({
        imageUri,
        email,
        phoneNumber,
        givenName,
        middleName,
        familyName,
        birthdate
      });
    } catch (error) {
      logger.debug(`ngOnInit()`, `Auth.currentAuthenticatedUser() Error`, error);
    }
  }

  clearEmail() {
    this.formGroup.controls.email.setValue(null);
  }

  async save() {
    if (this.formGroup.valid) {
      this.isSaving = true;
      const {
        imageUri,
        email,
        phoneNumber,
        givenName: given_name,
        middleName,
        familyName: family_name,
        birthdate
      } = this.formGroup.value;
      try {
        const attributes: ICognitoUserAttributes = {
          email,
          picture: imageUri || ``,
          phone_number: phoneNumber || ``,
          given_name,
          middle_name: middleName || ``,
          family_name,
          birthdate: birthdate?.split(`T`)[0]
        };
        await Auth.updateUserAttributes(this.user, attributes);
        attributes.sub = this.user.attributes.sub;
        await this.session.updateUser(attributes);
        this.isSaving = false;
      } catch (error) {
        logger.error(`Auth.updateUserAttributes() Error`, error);
      }
    }
  }
}
