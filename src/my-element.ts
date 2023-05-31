import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import './elements/input/input';
import './elements/button/button';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  render() {
    return html`
    <form id="simple-form" class="input-validation-type">
        <t-input
          name="name"
          label="Name"
          help-text="What would you like people to call you?"
          autocomplete="off"
          required
        ></t-input>

        <br />
  <t-button type="submit" variant="primary">Submit</t-button>
  <t-button type="reset" variant="default">Reset</t-button>
      </form>
    `;
  }

  connectedCallback() {
    const simpleForm = document.getElementById('simple-form');

    simpleForm.addEventListener('submit', (e) => {
      // pause to allow validation
      e.preventDefault();

      let invalidFields = simpleForm.querySelectorAll('[invalid]');

      if (invalidFields.length > 0) {
        invalidFields.forEach((field) => {
          // apply styles
          field.isInvalid();
        });
        // focus the first invalid field
        invalidFields[0].focus();
      } else {
        // create a FormData obj
        this.simpleData = new FormData(simpleForm);

        let fields = simpleForm.querySelectorAll('.field');
        fields.forEach((field) => {
          // add each label/value pair to the FormData obj
          // the `set` method adds new or replaces existing values
          // https://developer.mozilla.org/en-US/docs/Web/API/FormData/set
          let name = field.getAttribute('label');
          let val = field.getAttribute('value');
          this.simpleData.set(name, val);
        });

        // at this point you can package and send your data in a few ways, more here:
        // https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
        // replace the following with submission logic :)
        let feedbackArr = [];
        for (let [name, value] of this.simpleData) {
          feedbackArr.push(`${name}: ${value}`);
        }
        feedback.innerHTML =
          `<h3>Form values submitted:</h3>` + feedbackArr.join(', ');
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
