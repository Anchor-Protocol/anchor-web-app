import { isDesktopChrome } from '@terra-dev/is-desktop-chrome';
import { AccAddress, Extension } from '@terra-money/terra.js';
import { BehaviorSubject } from 'rxjs';
import {
  extensionFixer,
  FixedExtension,
  StationNetworkInfo,
} from './extensionFixer';
import { ChromeExtensionStatus } from './types';

const storage = localStorage;

const WALLET_ADDRESS: string = '__anchor_terra_station_wallet_address__';

const desktopChrome: boolean = isDesktopChrome() === true;

interface ChromeExtensionClientOptions {
  defaultNetwork: StationNetworkInfo;
  enableWalletConnection: boolean;
}

export class ChromeExtensionClient {
  readonly status: BehaviorSubject<ChromeExtensionStatus>;
  readonly networkInfo: BehaviorSubject<StationNetworkInfo>;
  readonly walletAddress: BehaviorSubject<string | null>;
  readonly extension: FixedExtension;

  private doneFirstCheck = false;

  constructor(readonly options: ChromeExtensionClientOptions) {
    this.status = new BehaviorSubject<ChromeExtensionStatus>(
      desktopChrome
        ? ChromeExtensionStatus.INITIALIZING
        : ChromeExtensionStatus.UNAVAILABLE,
    );
    this.networkInfo = new BehaviorSubject<StationNetworkInfo>(
      options.defaultNetwork,
    );
    this.walletAddress = new BehaviorSubject<string | null>(
      storage.getItem(WALLET_ADDRESS) ?? null,
    );
    this.extension = extensionFixer(new Extension());

    if (desktopChrome) {
      this.checkStatus(true);
    }
  }

  checkStatus = async (waitingExtensionScriptInjection: boolean = false) => {
    // do not check if browser isn't a chrome
    if (!desktopChrome) {
      return;
    }

    // ignore the checks before first check done
    // first check -------------------------------→ done
    // --------------- second check (ignore)
    if (!waitingExtensionScriptInjection && !this.doneFirstCheck) {
      return;
    }

    // check the extension installed
    const isExtensionInstalled = waitingExtensionScriptInjection
      ? await intervalCheck(20, () => this.extension.isAvailable())
      : this.extension.isAvailable();

    this.doneFirstCheck = true;

    if (!isExtensionInstalled) {
      this.status.next(ChromeExtensionStatus.UNAVAILABLE);
      return;
    }

    // get networkInfo from extension
    const infoPayload = await this.extension.info();

    if (
      infoPayload &&
      this.networkInfo.getValue().chainID !== infoPayload.chainID
    ) {
      this.networkInfo.next(infoPayload);
    }

    if (this.options.enableWalletConnection) {
      const storageStoredWalletAddress: string | null = storage.getItem(
        WALLET_ADDRESS,
      );

      // if the storage has wallet address
      if (
        storageStoredWalletAddress &&
        AccAddress.validate(storageStoredWalletAddress)
      ) {
        const connectResult = await this.extension.connect();

        // if address of extension is not same with the address of localStorage
        if (
          connectResult.address &&
          AccAddress.validate(connectResult.address) &&
          connectResult.address !== storageStoredWalletAddress
        ) {
          storage.setItem(WALLET_ADDRESS, connectResult.address);
        }

        if (
          connectResult.address &&
          this.walletAddress.getValue() !== connectResult.address
        ) {
          this.walletAddress.next(connectResult.address);
          this.status.next(ChromeExtensionStatus.WALLET_CONNECTED);
        }
      } else {
        if (storageStoredWalletAddress) {
          storage.removeItem(WALLET_ADDRESS);
        }

        this.status.next(ChromeExtensionStatus.WALLET_NOT_CONNECTED);
        this.walletAddress.next(null);
      }
    } else {
      this.status.next(ChromeExtensionStatus.WALLET_NOT_CONNECTED);
      this.walletAddress.next(null);
    }
  };

  connect = async () => {
    const result = await this.extension.connect();

    if (result?.address) {
      const walletAddress: string = result.address;
      storage.setItem(WALLET_ADDRESS, walletAddress);

      await this.checkStatus();
    }
  };

  disconnect = () => {
    storage.removeItem(WALLET_ADDRESS);

    this.checkStatus();
  };

  post = <SendData extends {}, Payload extends {}>(
    data: SendData,
  ): Promise<{ name: string; payload: Payload }> => {
    return this.extension.post(data);
  };
}

async function intervalCheck(
  count: number,
  fn: () => boolean,
  intervalMs: number = 500,
): Promise<boolean> {
  let i: number = -1;
  while (++i < count) {
    if (fn()) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return false;
}
