type TFocusEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    't-focus': TFocusEvent;
  }
}

export default TFocusEvent;
