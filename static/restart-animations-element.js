const html = String.raw;

export class RestartAnimationsElement extends HTMLElement {
  #controller;

  get #buttonElement() {
    return this.shadowRoot.querySelector(":host > button");
  }

  #restartAnimations() {
    for (const animation of this.ownerDocument.getAnimations()) {
      animation.cancel();
      animation.play();
    }
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow();
      this.shadowRoot.innerHMTL = html`
        <button type="button" part="button"><slot>Restart Animations</slot></button>
      `;
    }

    this.#controller = new AbortController();

    this.#buttonElement?.addEventListener(
      "click",
      this.#restartAnimations.bind(this),
      { signal: this.#controller.signal },
    );
  }

  disconnectedCallback() {
    this.#controller.abort();
  }

  static define() {
    if (!window.customElements.get("restart-animations")) {
      window.RestartAnimationsElement = RestartAnimationsElement;
      window.customElements.define(
        "restart-animations",
        RestartAnimationsElement,
      );
    }
  }
}
