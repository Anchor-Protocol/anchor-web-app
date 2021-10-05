export interface BlockObserver {
  lastSyncedHeight: () => Promise<number>;
  open: () => void;
  close: () => void;
}

interface NewBlockData {
  block: {
    header: {
      height: string;
    };
  };
}

class BlockObserverImpl implements BlockObserver {
  private ws: WebSocket | null = null;
  private blockHeight: number = -1;
  private opened: boolean = false;

  constructor(private endpoint: string, private chainID: string) {}

  lastSyncedHeight = () => {
    return Promise.resolve(this.blockHeight);
  };

  open = () => {
    this.opened = true;
    this.openWebSocket(this.endpoint, this.chainID);
  };

  close = () => {
    this.opened = false;

    if (this.ws) {
      this.closeWebSocket(this.ws);
      this.ws = null;
    }
  };

  private openWebSocket = (endpoint: string, chainID: string) => {
    const ws = new WebSocket(endpoint);

    ws.onopen = () => {
      ws.send(JSON.stringify({ subscribe: 'new_block', chain_id: chainID }));
    };

    ws.onmessage = (evt: MessageEvent<string>) => {
      try {
        const data: NewBlockData = JSON.parse(evt.data);
        this.blockHeight = +data.block.header.height;
      } catch {}
    };

    ws.onclose = () => {
      if (this.opened) {
        setTimeout(() => {
          this.openWebSocket(endpoint, chainID);
        }, 1000);
      }
    };

    this.ws = ws;
  };

  private closeWebSocket = (ws: WebSocket) => {
    ws.onopen = null;
    ws.onmessage = null;
    ws.onclose = null;
    ws.close();
  };
}

export function createBlockObserver(
  endpoint: string,
  chainID: string,
): BlockObserver {
  return new BlockObserverImpl(endpoint, chainID);
}
