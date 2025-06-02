declare module 'event-source-polyfill' {
  export class EventSourcePolyfill {
    constructor(url: string, eventSourceInitDict?: any);
    close(): void;
    addEventListener(type: string, listener: (event: MessageEvent) => void): void;
    onerror: ((event: Event) => any) | null;
  }
}