export namespace crossAnchor {
  export namespace core {
    export interface TerraAddress {
      terra_address: {
        sender_chain: number;
        sender_address: string;
      };
    }

    export type TerraAddressResponse = string;
  }
}
