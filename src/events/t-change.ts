type TChangeEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    't-change': TChangeEvent;
  }
}

export default TChangeEvent;
