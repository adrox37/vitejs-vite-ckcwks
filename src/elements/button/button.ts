import { unsafeCSS } from 'lit';
import { html, literal } from 'lit/static-html.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, query, state } from 'lit/decorators.js';

// tally imports.
import TallyElement from '../../models/tally-element';
import { watch } from '../../helpers/utils/watch';
import {
  FormControlController,
  validValidityState,
} from '../../controllers/form';
import { SlotController } from '../../controllers/slot';
import { TallyFormControl } from '../../models/tally-element';

/**
 * @element t-button
 * @summary tally button element
 *
 *
 * @slot - default slot
 *
 * @fires clicked - dispatched when button is clic
 *
 */
@customElement('t-button')
export default class TButton extends TallyElement implements TallyFormControl {
  private readonly formControlController = new FormControlController(this, {
    form: (input) => {
      // Buttons support a form attribute that points to an arbitrary form, so if this attribute is set we need to query
      // the form from the same root using its id
      if (input.hasAttribute('form')) {
        const doc = input.getRootNode() as Document | ShadowRoot;
        const formId = input.getAttribute('form')!;
        return doc.getElementById(formId) as HTMLFormElement;
      }

      // Fall back to the closest containing form
      return input.closest('form');
    },
    assumeInteractionOn: ['click'],
  });

  private readonly slotController = new SlotController(
    this,
    '[default]',
    'prefix',
    'suffix'
  );

  @query('.btn') button: HTMLButtonElement | HTMLLinkElement;

  @state() private hasFocus = false;
  @state() invalid = false;

  @property() override title = '';

  @property({ reflect: true }) variant:
    | 'danger'
    | 'dark'
    | 'info'
    | 'light'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'tertiary'
    | 'warning' = 'primary';

  @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: Boolean, reflect: true }) loading = false;

  @property() type: 'button' | 'submit' | 'reset' = 'button';

  @property({ type: Boolean, reflect: true }) reverse = false;

  @property({ type: Boolean, reflect: true }) transparent = false;

  @property() override id = '';

  @property() name = '';

  @property() value = '';

  @property() href = '';

  @property() target: '_blank' | '_parent' | '_self' | '_top';

  @property() rel = 'noreferrer noopener';

  @property() download?: string;

  @property() form: string;

  @property({ attribute: 'formaction' }) formAction: string;

  @property({ attribute: 'formenctype' }) formEnctype:
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain';

  @property({ attribute: 'formmethod' }) formMethod: 'post' | 'get';

  @property({ attribute: 'formnovalidate', type: Boolean })
  formNoValidate: boolean;

  @property({ attribute: 'formtarget' }) formTarget:
    | '_blank'
    | '_parent'
    | '_self'
    | '_top'
    | string;

  get validity() {
    if (this.isButton()) {
      return (this.button as HTMLButtonElement).validity;
    }

    return validValidityState;
  }

  /** Gets the validation message */
  get validationMessage() {
    if (this.isButton()) {
      return (this.button as HTMLButtonElement).validationMessage;
    }

    return '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.handleHostClick = this.handleHostClick.bind(this);
    this.addEventListener('click', this.handleHostClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.handleHostClick);
  }

  firstUpdated() {
    if (this.isButton()) {
      this.formControlController.updateValidity();
    }
  }

  private handleBlur() {
    this.hasFocus = false;
    this.emit('t-blur');
  }

  private handleFocus() {
    this.hasFocus = true;
    this.emit('t-focus');
  }

  private handleClick() {
    if (this.type === 'submit') {
      this.formControlController.submit(this);
    }

    if (this.type === 'reset') {
      this.formControlController.reset(this);
    }
  }

  private handleHostClick(event: MouseEvent) {
    // Prevent the click event from being emitted when the button is disabled or loading
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  private handleInvalid(event: Event) {
    this.formControlController.setValidity(false);
    this.formControlController.emitInvalidEvent(event);
  }

  private isButton() {
    return this.href ? false : true;
  }

  private isLink() {
    return this.href ? true : false;
  }

  @watch('disabled', { waitUntilFirstUpdate: true })
  handleDisabledChange() {
    if (this.isButton()) {
      // Disabled form controls are always valid
      this.formControlController.setValidity(this.disabled);
    }
  }

  /** Simulates a click on the button. */
  click() {
    this.button.click();
  }

  /** Sets focus on the button. */
  focus(options?: FocusOptions) {
    this.button.focus(options);
  }

  /** Removes focus from the button. */
  blur() {
    this.button.blur();
  }

  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    if (this.isButton()) {
      return (this.button as HTMLButtonElement).checkValidity();
    }

    return true;
  }

  /** Gets the associated form, if one exists. */
  getForm(): HTMLFormElement | null {
    return this.formControlController.getForm();
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    if (this.isButton()) {
      return (this.button as HTMLButtonElement).reportValidity();
    }

    return true;
  }

  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(message: string) {
    if (this.isButton()) {
      (this.button as HTMLButtonElement).setCustomValidity(message);
      this.formControlController.updateValidity();
    }
  }

  render() {
    const isLink = this.isLink();
    const tag = isLink ? literal`a` : literal`button`;
    const btnClasses = {
      btn: true,
      button: true,
      danger: this.variant === 'danger',
      dark: this.variant === 'dark',
      info: this.variant === 'info',
      light: this.variant === 'light',
      primary: this.variant === 'primary',
      secondary: this.variant === 'secondary',
      success: this.variant === 'success',
      tertiary: this.variant === 'tertiary',
      warning: this.variant === 'warning',
    };

    return html`
      <${tag}
        class=${classMap(btnClasses)}
        ?disabled="${this.disabled}"
        ?reverse="${this.reverse}"
        ?transparent="${this.transparent}"
        type=${ifDefined(isLink ? undefined : this.type)}
        name=${ifDefined(isLink ? undefined : this.name)}
        value=${ifDefined(isLink ? undefined : this.value)}
        href=${ifDefined(isLink ? this.href : undefined)}
        target=${ifDefined(isLink ? this.target : undefined)}
        download=${ifDefined(isLink ? this.download : undefined)}
        rel=${ifDefined(isLink ? this.rel : undefined)}
        role=${ifDefined(isLink ? undefined : 'button')}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        tabindex=${this.disabled ? '-1' : '0'}
        id="${this.id}"
        title="${this.title}"
        aria-busy="${this.loading}"
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton() ? this.handleInvalid : null}
        @click=${this.handleClick}
      >
        <slot name="prefix"></slot>
        <slot></slot>
        <slot name="suffix"></slot>
      </${tag}>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    't-button': TButton;
  }
}
