type TClearEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    't-clear': TClearEvent;
  }
}

export default TClearEvent;
