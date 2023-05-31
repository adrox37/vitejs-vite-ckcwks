type TBlurEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    't-blur': TBlurEvent;
  }
}

export default TBlurEvent;
