import { html, unsafeCSS } from 'lit';
import { live } from 'lit/directives/live.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, query, state } from 'lit/decorators.js';

// tally imports.
import TallyElement from '../../models/tally-element';
import { defaultValue } from '../../helpers/utils/default-value';
import { FormControlController } from '../../controllers/form';
import { watch } from '../../helpers/utils/watch';
import { SlotController } from '../../controllers/slot';
// import tallyVars from '../../styles/tally-vars.scss?inline';
// import inputCss from './input.scss?inline';
import { TallyFormControl } from '../../models/tally-element';

@customElement('t-input')
export class TInput extends TallyElement implements TallyFormControl {
  // static styles = unsafeCSS([tallyVars, inputCss]);
  // static formAssociated = true

  private readonly formControlController = new FormControlController(this, {
    assumeInteractionOn: ['t-blur', 't-input'],
  });

  private readonly slotController = new SlotController(
    this,
    'help-text',
    'label'
  );
  @query('.input__control') input: HTMLInputElement;

  @state() private hasFocus = false;
  @property() title = ''; // make reactive to pass through

  // @property({ reflect: true }) type: 'text' | 'email' | 'number' | 'tel' | 'date' = 'text'

  @property({ reflect: true }) type:
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'time'
    | 'url' = 'text';

  @property() name = '';
  @property() value = '';

  @defaultValue() defaultValue = '';

  @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';
  @property() label = '';

  @property({ attribute: 'help-text' }) helpText = '';
  @property({ type: Boolean }) clearable = false;

  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() placeholder = undefined;

  @property({ type: Boolean }) readonly = false;

  // @property({ type: Boolean, reflect: true }) error = false

  /** Adds a button to toggle the password's visibility. Only applies to password types. */
  @property({ attribute: 'password-toggle', type: Boolean })
  passwordToggle = false;

  /** Determines whether or not the password is currently visible. Only applies to password input types. */
  @property({ attribute: 'password-visible', type: Boolean })
  passwordVisible = false;

  /** Hides the browser's built-in increment/decrement spin buttons for number inputs. */
  @property({ attribute: 'no-spin-buttons', type: Boolean })
  noSpinButtons = false;

  /**
   * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
   * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
   * the same document or shadow root for this to work.
   */
  @property({ reflect: true }) form = '';
  @property({ type: Boolean, reflect: true }) required = false;
  @property() pattern = undefined;

  /** The minimum length of input that will be considered valid. */
  @property({ type: Number }) minlength: number;

  /** The maximum length of input that will be considered valid. */
  @property({ type: Number }) maxlength: number;

  /** The input's minimum value. Only applies to date and number input types. */
  @property() min: number | string;

  /** The input's maximum value. Only applies to date and number input types. */
  @property() max: number | string;

  /**
   * Specifies the granularity that the value must adhere to, or the special value `any` which means no stepping is
   * implied, allowing any numeric value. Only applies to date and number input types.
   */
  @property() step: number | 'any';

  /** Controls whether and how text input is automatically capitalized as it is entered by the user. */
  @property() autocapitalize:
    | 'off'
    | 'none'
    | 'on'
    | 'sentences'
    | 'words'
    | 'characters';

  /** Indicates whether the browser's autocorrect feature is on or off. */
  @property() autocorrect: 'off' | 'on';

  /**
   * Specifies what permission the browser has to provide assistance in filling out form field values. Refer to
   * [this page on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for available values.
   */
  @property() autocomplete: string;

  /** Indicates that the input should receive focus on page load. */
  @property({ type: Boolean }) autofocus: boolean;

  @property() inputmode:
    | 'none'
    | 'text'
    | 'decimal'
    | 'numeric'
    | 'tel'
    | 'search'
    | 'email'
    | 'url';

  // @property({ type: Object }) messaging = {}

  // @property() id = this.name

  /** Gets or sets the current value as a `Date` object. Returns `null` if the value can't be converted. */
  get valueAsDate() {
    const input = document.createElement('input');
    input.type = 'date';
    input.value = this.value;
    return input.valueAsDate;
  }

  set valueAsDate(newValue: Date | null) {
    const input = document.createElement('input');
    input.type = 'date';
    input.valueAsDate = newValue;
    this.value = input.value;
  }

  /** Gets or sets the current value as a number. Returns `NaN` if the value can't be converted. */
  get valueAsNumber() {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = this.value;
    return input.valueAsNumber;
  }

  set valueAsNumber(newValue: number) {
    const input = document.createElement('input');
    input.type = 'number';
    input.valueAsNumber = newValue;
    this.value = input.value;
  }

  /** Gets the validity state object */
  get validity() {
    return this.input.validity;
  }

  /** Gets the validation message */
  get validationMessage() {
    return this.input.validationMessage;
  }

  firstUpdated() {
    this.formControlController.updateValidity();
  }

  private handleBlur() {
    this.hasFocus = false;
    this.emit('t-blur');
  }

  private handleChange() {
    this.value = this.input.value;
    this.emit('t-change');
  }

  private handleClearClick(event: MouseEvent) {
    this.value = '';
    this.emit('t-clear');
    this.emit('t-input');
    this.emit('t-change');
    this.input.focus();

    event.stopPropagation();
  }

  private handleFocus() {
    this.hasFocus = true;
    this.emit('t-focus');
  }

  private handleInput() {
    this.value = this.input.value;
    this.formControlController.updateValidity();
    this.emit('t-input');
  }

  private handleInvalid(event: Event) {
    this.formControlController.setValidity(false);
    this.formControlController.emitInvalidEvent(event);
  }

  private handleKeyDown(event: KeyboardEvent) {
    const hasModifier =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    // Pressing enter when focused on an input should submit the form like a native input, but we wait a tick before
    // submitting to allow users to cancel the keydown event if they need to
    if (event.key === 'Enter' && !hasModifier) {
      setTimeout(() => {
        //
        // When using an Input Method Editor (IME), pressing enter will cause the form to submit unexpectedly. One way
        // to check for this is to look at event.isComposing, which will be true when the IME is open.
        //
        // See https://github.com/shoelace-style/shoelace/pull/988
        //
        if (!event.defaultPrevented && !event.isComposing) {
          this.formControlController.submit();
        }
      });
    }
  }

  private handlePasswordToggle() {
    this.passwordVisible = !this.passwordVisible;
  }

  @watch('disabled', { waitUntilFirstUpdate: true })
  handleDisabledChange() {
    // Disabled form controls are always valid
    this.formControlController.setValidity(this.disabled);
  }

  @watch('step', { waitUntilFirstUpdate: true })
  handleStepChange() {
    // If step changes, the value may become invalid so we need to recheck after the update. We set the new step
    // imperatively so we don't have to wait for the next render to report the updated validity.
    this.input.step = String(this.step);
    this.formControlController.updateValidity();
  }

  @watch('value', { waitUntilFirstUpdate: true })
  async handleValueChange() {
    await this.updateComplete;
    this.formControlController.updateValidity();
  }

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  focus(options?: FocusOptions) {
    this.input.focus(options);
  }

  /** Removes focus from the input. */
  blur() {
    this.input.blur();
  }

  /** Selects all the text in the input. */
  select() {
    this.input.select();
  }

  /** Sets the start and end positions of the text selection (0-based). */
  setSelectionRange(
    selectionStart: number,
    selectionEnd: number,
    selectionDirection: 'forward' | 'backward' | 'none' = 'none'
  ) {
    this.input.setSelectionRange(
      selectionStart,
      selectionEnd,
      selectionDirection
    );
  }

  /** Replaces a range of text with a new string. */
  setRangeText(
    replacement: string,
    start?: number,
    end?: number,
    selectMode?: 'select' | 'start' | 'end' | 'preserve'
  ) {
    // @ts-expect-error - start, end, and selectMode are optional
    this.input.setRangeText(replacement, start, end, selectMode);

    if (this.value !== this.input.value) {
      this.value = this.input.value;
    }
  }

  /** Displays the browser picker for an input element (only works if the browser supports it for the input type). */
  showPicker() {
    if ('showPicker' in HTMLInputElement.prototype) {
      this.input.showPicker();
    }
  }

  /** Increments the value of a numeric input type by the value of the step attribute. */
  stepUp() {
    this.input.stepUp();
    if (this.value !== this.input.value) {
      this.value = this.input.value;
    }
  }

  /** Decrements the value of a numeric input type by the value of the step attribute. */
  stepDown() {
    this.input.stepDown();
    if (this.value !== this.input.value) {
      this.value = this.input.value;
    }
  }

  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    return this.input.checkValidity();
  }

  /** Gets the associated form, if one exists. */
  getForm(): HTMLFormElement | null {
    return this.formControlController.getForm();
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    return this.input.reportValidity();
  }

  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(message: string) {
    this.input.setCustomValidity(message);
    this.formControlController.updateValidity();
  }

  render() {
    const hasLabelSlot = this.slotController.test('label');
    const hasHelpTextSlot = this.slotController.test('help-text');
    const hasLabel = this.label ? true : !!hasLabelSlot;
    const hasHelpText = this.helpText ? true : !!hasHelpTextSlot;
    const hasClearIcon =
      this.clearable &&
      !this.disabled &&
      !this.readonly &&
      (typeof this.value === 'number' || this.value.length > 0);

    return html`
      <div
        part="form-control"
        class=${classMap({
          'form-control': true,
          'form-control--small': this.size === 'small',
          'form-control--medium': this.size === 'medium',
          'form-control--large': this.size === 'large',
          'form-control--has-label': hasLabel,
          'form-control--has-help-text': hasHelpText,
        })}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${hasLabel ? 'false' : 'true'}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${classMap({
              input: true,

              // Sizes
              'input--small': this.size === 'small',
              'input--medium': this.size === 'medium',
              'input--large': this.size === 'large',

              // States
              'input--pill': this.pill,
              'input--standard': !this.filled,
              'input--filled': this.filled,
              'input--disabled': this.disabled,
              'input--focused': this.hasFocus,
              'input--empty': !this.value,
              'input--no-spin-buttons': this.noSpinButtons,
            })}
          >
            <slot name="prefix" part="prefix" class="input__prefix"></slot>
            <input
              part="input"
              id="input"
              class="input__control"
              type=${
                this.type === 'password' && this.passwordVisible
                  ? 'text'
                  : this.type
              }
              title=${
                this
                  .title /* An empty title prevents browser validation tooltips from appearing on hover */
              }
              name=${ifDefined(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${ifDefined(this.placeholder)}
              minlength=${ifDefined(this.minlength)}
              maxlength=${ifDefined(this.maxlength)}
              min=${ifDefined(this.min)}
              max=${ifDefined(this.max)}
              step=${ifDefined(this.step as number)}
              .value=${live(this.value)}
              autocapitalize=${ifDefined(this.autocapitalize)}
              autocomplete=${ifDefined(this.autocomplete)}
              autocorrect=${ifDefined(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${ifDefined(this.pattern)}
              enterkeyhint=${ifDefined(this.enterkeyhint)}
              inputmode=${ifDefined(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${
              hasClearIcon
                ? html`
                    <button
                      part="clear-button"
                      class="input__clear"
                      type="button"
                      aria-label=${this.localize.term('clearEntry')}
                      @click=${this.handleClearClick}
                      tabindex="-1"
                    >
                      <slot name="clear-icon">
                        <sl-icon name="x-circle-fill" library="system"></sl-icon>
                      </slot>
                    </button>
                  `
                : ''
            }
            ${
              this.passwordToggle && !this.disabled
                ? html`
                    <button
                      part="password-toggle-button"
                      class="input__password-toggle"
                      type="button"
                      aria-label=${this.localize.term(
                        this.passwordVisible ? 'hidePassword' : 'showPassword'
                      )}
                      @click=${this.handlePasswordToggle}
                      tabindex="-1"
                    >
                      ${
                        this.passwordVisible
                          ? html`
                            <slot name="show-password-icon">
                              <sl-icon name="eye-slash" library="system"></sl-icon>
                            </slot>
                          `
                          : html`
                            <slot name="hide-password-icon">
                              <sl-icon name="eye" library="system"></sl-icon>
                            </slot>
                          `
                      }
                    </button>
                  `
                : ''
            }

            <slot name="suffix" part="suffix" class="input__suffix"></slot>
          </div>
        </div>

        <slot
          name="help-text"
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${hasHelpText ? 'false' : 'true'}
        >
          ${this.helpText}
        </slot>
        </div>
      </div>
    `;
  }

  // render() {
  //   const lblClasses = {
  //     'required': this.required
  //   }

  //   const inputClasses = {
  //     'input__control': true,
  //     'required': this.required
  //   }

  //   return html`
  //     ${this.label
  //       ? html`<label class="${classMap(lblClasses)}" for="${this.id}" part="label">${this.label}</label>`
  //       : ''
  //     }
  //     <input
  //       ?aria-invalid="${this.error}"
  //       ?disabled="${this.disabled}"
  //       ?readonly="${this.readonly}"
  //       ?required="${ifDefined(this.required ? 'true' : undefined)}"
  //       .value=${live(this.value)}
  //       class="${classMap(inputClasses)}"
  //       id="${this.id}"
  //       maxlength="${ifDefined(this.maxLength ? this.maxLength : undefined)}"
  //       minlength="${ifDefined(this.minLength ? this.minLength : undefined)}"
  //       name="${ifDefined(this.name)}"
  //       pattern="${ifDefined(this.pattern)}"
  //       placeholder="${ifDefined(this.placeholder)}"
  //       min="${ifDefined(this.min)}"
  //       max="${ifDefined(this.max)}"
  //       type="${this.type}"
  //       part="input"
  //       @blur="${this.onBlur}"
  //       @focus="${this.onFocus}"
  //       @input="${this.onInput}"
  //     >
  //     ${this.message
  //       ? html`<small class="message ${this.errored ? 'errored-msg' : ''}">${this.message}</small>`
  //       : ''
  //     }
  //     ${this._internals.validationMessage
  //       ? html`<small class="error" role="tooltip">${this._internals.validationMessage}</small>`
  //       : ''
  //     }
  //   `
  // }
}

declare global {
  interface HTMLElementTagNameMap {
    't-input': TInput;
  }
}
