import {
  clearStore,
  getStoredAddress,
  storeAddress,
} from '@terra-dev/extension/storage';
import { isDesktopChrome } from '@terra-dev/is-desktop-chrome';
import { AccAddress, Extension } from '@terra-money/terra.js';
import { BehaviorSubject } from 'rxjs';
import {
  extensionFixer,
  FixedExtension,
  StationNetworkInfo,
} from './extensionFixer';
import { ChromeExtensionStatus } from './types';

const desktopChrome: boolean = isDesktopChrome() === true;

interface ChromeExtensionClientOptions {
  defaultNetwork: StationNetworkInfo;
  enableWalletConnection: boolean;
}

export class ChromeExtensionClient {
  readonly _status: BehaviorSubject<ChromeExtensionStatus>;
  readonly _networkInfo: BehaviorSubject<StationNetworkInfo>;
  readonly _walletAddress: BehaviorSubject<string | null>;
  readonly _extension: FixedExtension;

  private doneFirstCheck = false;

  constructor(readonly options: ChromeExtensionClientOptions) {
    this._status = new BehaviorSubject<ChromeExtensionStatus>(
      desktopChrome
        ? ChromeExtensionStatus.INITIALIZING
        : ChromeExtensionStatus.UNAVAILABLE,
    );
    this._networkInfo = new BehaviorSubject<StationNetworkInfo>(
      options.defaultNetwork,
    );
    this._walletAddress = new BehaviorSubject<string | null>(
      getStoredAddress(),
    );
    this._extension = extensionFixer(new Extension());

    if (desktopChrome) {
      this.checkStatus(true);
    }
  }

  status = () => {
    return this._status.asObservable();
  };

  networkInfo = () => {
    return this._networkInfo.asObservable();
  };

  walletAddress = () => {
    return this._walletAddress.asObservable();
  };

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
      ? await intervalCheck(20, () => this._extension.isAvailable())
      : this._extension.isAvailable();

    this.doneFirstCheck = true;

    if (!isExtensionInstalled) {
      this._status.next(ChromeExtensionStatus.UNAVAILABLE);
      return;
    }

    // get networkInfo from extension
    const infoPayload = await this._extension.info();

    if (
      infoPayload &&
      this._networkInfo.getValue().chainID !== infoPayload.chainID
    ) {
      this._networkInfo.next(infoPayload);
    }

    if (this.options.enableWalletConnection) {
      const storageStoredWalletAddress: string | null = getStoredAddress();

      // if the storage has wallet address
      if (
        storageStoredWalletAddress &&
        AccAddress.validate(storageStoredWalletAddress)
      ) {
        const connectResult = await this._extension.connect();

        // if address of extension is not same with the address of localStorage
        if (
          connectResult.address &&
          AccAddress.validate(connectResult.address) &&
          connectResult.address !== storageStoredWalletAddress
        ) {
          storeAddress(connectResult.address);
        }

        if (
          connectResult.address &&
          this._walletAddress.getValue() !== connectResult.address
        ) {
          this._walletAddress.next(connectResult.address);
          this._status.next(ChromeExtensionStatus.WALLET_CONNECTED);
        }
      } else {
        if (storageStoredWalletAddress) {
          clearStore();
        }

        this._status.next(ChromeExtensionStatus.WALLET_NOT_CONNECTED);
        this._walletAddress.next(null);
      }
    } else {
      this._status.next(ChromeExtensionStatus.WALLET_NOT_CONNECTED);
      this._walletAddress.next(null);
    }
  };

  connect = async () => {
    const result = await this._extension.connect();

    if (result?.address) {
      const walletAddress: string = result.address;
      storeAddress(walletAddress);

      await this.checkStatus();
    }

    return result?.address ?? false;
  };

  disconnect = () => {
    clearStore();
    this.checkStatus();
  };

  recheckStatus = () => {
    if (!this._extension.inTransactionProgress()) {
      this.checkStatus(false);
    }
  };

  post = <SendData extends {}, Payload extends {}>(
    data: SendData,
  ): Promise<{ name: string; payload: Payload }> => {
    return this._extension.post(data);
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
