import { Gas, Rate } from '@anchor-protocol/types';
import { AnchorContantsInput, ExpandAddressMap } from './types';

// ---------------------------------------------
// TODO migration col4 -> col5
// ---------------------------------------------
// FIXME change block height
// TODO set undefined after col-5 up
export const MAINTANANCE_DOWN_BLOCK: number | undefined = undefined;

// FIXME change to true after down block-height
// TODO change to false after col-5 up
export const FORCE_MAINTANANCE_DOWN: boolean = true;

// FIXME to true before oracle bot ready
// TODO to false after oracle bot ready
export const USE_EXTERNAL_ORACLE_PRICE = true;

export const DEFAULT_ADDESS_MAP: Record<string, ExpandAddressMap> = {
  mainnet: {
    bLunaHub: 'terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts',
    bLunaToken: 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp',
    bLunaReward: 'terra17yap3mhph35pcwvhza38c2lkj7gzywzy05h7l0',
    bLunaAirdrop: 'terra199t7hg7w5vymehhg834r6799pju2q3a0ya7ae9',
    bEthReward: 'terra1939tzfn4hn960ychpcsjshu8jds3zdwlp8jed9',
    bEthToken: 'terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun',
    mmCustodyBEth: 'terra10cxuzggyvvv44magvrh3thpdnk9cmlgk93gmx2',
    mmInterestModel: 'terra1kq8zzq5hufas9t0kjsjc62t2kucfnx8txf547n',
    mmOracle: 'terra1cgg6yef7qcdm070qftghfulaxmllgmvk77nc7t',
    mmMarket: 'terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s',
    mmOverseer: 'terra1tmnqgvg567ypvsvk6rwsga3srp7e3lg6u0elp8',
    mmCustody: 'terra1ptjp2vfjrwh0j0faj9r6katm640kgjxnwwq9kn',
    mmLiquidation: 'terra1w9ky73v4g7v98zzdqpqgf3kjmusnx4d4mvnac6',
    mmDistributionModel: 'terra14mufqpr5mevdfn92p4jchpkxp7xr46uyknqjwq',
    aTerra: 'terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu',
    terraswapblunaLunaPair: 'terra1jxazgm67et0ce260kvrpfv50acuushpjsz2y0p',
    terraswapblunaLunaLPToken: 'terra1nuy34nwnsh53ygpc4xprlj263cztw7vc99leh2',
    terraswapAncUstPair: 'terra1gm5p3ner9x9xpwugn9sp6gvhd0lwrtkyrecdn3',
    terraswapAncUstLPToken: 'terra1gecs98vcuktyfkrve9czrpgtg0m3aq586x6gzm',
    gov: 'terra1f32xyep306hhcxxxf7mlyh0ucggc00rm2s9da5',
    distributor: 'terra1mxf7d5updqxfgvchd7lv6575ehhm8qfdttuqzz',
    collector: 'terra14ku9pgw5ld90dexlyju02u4rn6frheexr5f96h',
    community: 'terra12wk8dey0kffwp27l5ucfumczlsc9aned8rqueg',
    staking: 'terra1897an2xux840p9lrh6py3ryankc6mspw49xse3',
    ANC: 'terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76',
    airdrop: 'terra146ahqn6d3qgdvmj8cj96hh03dzmeedhsf0kxqm',
    // TODO
    team_vesting: '',
    investor_vesting: '',
    //team: 'terra1pm54pmw3ej0vfwn3gtn6cdmaqxt0x37e9jt0za',
    //vesting: 'terra10evq9zxk2m86n3n3xnpw28jpqwp628c6dzuq42',
    terraswapFactory: 'terra1ulgw0td86nvs4wtpsc80thv6xelk76ut7a7apj',
  },
  testnet: {
    bLunaHub: 'terra1fflas6wv4snv8lsda9knvq2w0cyt493r8puh2e',
    bLunaToken: 'terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x',
    bLunaReward: 'terra1ac24j6pdxh53czqyrkr6ygphdeftg7u3958tl2',
    bLunaAirdrop: 'terra1334h20c9ewxguw9p9vdxzmr8994qj4qu77ux6q',
    bEthReward: 'terra1ja3snkedk4t0zp7z3ljd064hcln8dsv5x004na',
    bEthToken: 'terra19mkj9nec6e3y5754tlnuz4vem7lzh4n0lc2s3l',
    mmCustodyBEth: 'terra1j6fey5tl70k9fvrv7mea7ahfr8u2yv7l23w5e6',
    mmInterestModel: 'terra1m25aqupscdw2kw4tnq5ql6hexgr34mr76azh5x',
    mmOracle: 'terra1p4gg3p2ue6qy2qfuxtrmgv2ec3f4jmgqtazum8',
    mmMarket: 'terra15dwd5mj8v59wpj0wvt233mf5efdff808c5tkal',
    mmOverseer: 'terra1qljxd0y3j3gk97025qvl3lgq8ygup4gsksvaxv',
    mmCustody: 'terra1ltnkx0mv7lf2rca9f8w740ashu93ujughy4s7p',
    mmLiquidation: 'terra16vc4v9hhntswzkuunqhncs9yy30mqql3gxlqfe',
    mmDistributionModel: 'terra1u64cezah94sq3ye8y0ung28x3pxc37tv8fth7h',
    aTerra: 'terra1ajt556dpzvjwl0kl5tzku3fc3p3knkg9mkv8jl',
    terraswapblunaLunaPair: 'terra13e4jmcjnwrauvl2fnjdwex0exuzd8zrh5xk29v',
    terraswapblunaLunaLPToken: 'terra1tj4pavqjqjfm0wh73sh7yy9m4uq3m2cpmgva6n',
    terraswapAncUstPair: 'terra1wfvczps2865j0awnurk9m04u7wdmd6qv3fdnvz',
    terraswapAncUstLPToken: 'terra1vg0qyq92ky9z9dp0j9fv5rmr2s80sg605dah6f',
    gov: 'terra16ckeuu7c6ggu52a8se005mg5c0kd2kmuun63cu',
    distributor: 'terra1z7nxemcnm8kp7fs33cs7ge4wfuld307v80gypj',
    collector: 'terra1hlctcrrhcl2azxzcsns467le876cfuzam6jty4',
    community: 'terra17g577z0pqt6tejhceh06y3lyeudfs3v90mzduy',
    staking: 'terra19nxz35c8f7t3ghdxrxherym20tux8eccar0c3k',
    ANC: 'terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc',
    airdrop: 'terra1u5ywhlve3wugzqslqvm8ks2j0nsvrqjx0mgxpk',
    // TODO
    team_vesting: '',
    investor_vesting: '',
    //vesting: 'terra19f6ktw4qpjj9p9m49y8mhf6pr9807d44xdcus7',
    //team: 'terra1x7ted5g0g6ntyqdaqmjwtzcctvvrdju49vs8pl',
    terraswapFactory: 'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf',
  },
  // TODO change to testnet
  bombay: {
    bLunaHub: 'terra1yu5htygekjx5g4dpsma75q2q54qujgs8arn6mv',
    bLunaToken: 'terra16rcjetu65x0n7j96z0pjfynvlvdmgs0vwqyq8a',
    bLunaReward: 'terra1ytulpzp05j05cr4kxjlafh0sukt9fsqkuaexkp',
    bLunaAirdrop: 'terra1nwl3wv4r07g4pfdlwmrk4uwhxj8mfpu3x0uydf',
    bEthToken: 'terra1aqmm0xhg5kt62kpkuxtqf949djqa578we2ss7a',
    bEthReward: 'terra1l4le6adx709gvux3xqurgf02ma3c66l6qsqrl6',
    mmInterestModel: 'terra1g2y8yzr354m82nxrw0z9s600pue2dng5y79c0x',
    mmOracle: 'terra1j988p5qprjd2rhxnc8pw3as839wqxprgywfm9y',
    mmMarket: 'terra1rpvs6ashgp69dy9atfngcsnnnd3r3set82xlln',
    mmOverseer: 'terra1v6l6kqypskmel0vlnhuwewrhsppnpddh27afhe',
    mmCustody: 'terra1h5akp8gnu7g5shv0j3vq42r97ejg8rd6r7568x',
    mmCustodyBEth: 'terra19q79p7typ99r4crsjdwa8psua2apwgszry2jmk',
    mmLiquidation: 'terra139rf02qwt7eg0p7lzhvwuyqmc0rn6u90c7jxau',
    mmDistributionModel: 'terra15qwr7w2taevunjx87r4mxmxjvj23c82zemuuur',
    aTerra: 'terra12p3hnqk2et0c87kw9kxrfnt5k3cg38srmrxmw4',
    terraswapblunaLunaPair: 'terra1tk7ldkgpmqtsgpvdd3syg43tv3d0w8ac7ztgll',
    terraswapblunaLunaLPToken: 'terra1gy5v3yccyp4c5ku8t8t0hphjljq4k9kasq5jlc',
    terraswapAncUstPair: 'terra1ry2rhcj7x6dmc0vkp5w8ak550zumm0f8dr666j',
    terraswapAncUstLPToken: 'terra1uelhxg9yjkenhcqxe375xrd7r39udj7h9k2vh7',
    gov: 'terra1qr2gyjjqwah6v7v4pevf4rzhechntdse7v9knu',
    distributor: 'terra1cjdrv9h263pgyx7neppphfw6cctl448yr8f9vt',
    collector: 'terra1qvkamkw9q8g8a2989vtpn7xt3hz6nz9a79gyqg',
    community: 'terra19st0fzp93cq04n38l980pqv6sqx97t7e8784tw',
    staking: 'terra1e03m9zzly9cnyh6ncsc67q3ld2nlmyuz9mk4ls',
    ANC: 'terra10nzwrktm24r7pkq667aaq57jqaw8wpu2u6fggw',
    airdrop: 'terra1wtpds5253na3vcjnn3lmzczp6gpjgfuks9jamf',
    team_vesting: '',
    investor_vesting: '',
    //team: 'terra1s2ed0a056cuuxrh00l0k70guj5r3tn3849xzg3',
    //vesting: 'terra1w5pzksgt9g0reqnvn2rufc877qdfswfra5qwcd'
    terraswapFactory: 'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf',
  },
};

export const DEFAULT_ANCHOR_TX_CONSTANTS: Record<string, AnchorContantsInput> =
  {
    mainnet: {
      // FIXME re-named gasFee -> gasWanted
      gasWanted: 1_000_000 as Gas,
      // FIXME fixedGas = gas(1_671_053) * gas_price(0.38uusd) = 635_000uusd
      fixedGasGas: 1_671_053 as Gas,
      //fixedGas: 635_000 as u<UST<number>>,
      airdropGasWanted: 300_000 as Gas,
      // FIXME airdropFixedGas = gas(334_211) * gas_price(0.38uusd) = 127_000uusd
      airdropGasGas: 334_211 as Gas,
      blocksPerYear: 4_656_810,
      gasAdjustment: 1.6 as Rate<number>,
    },
    testnet: {
      gasWanted: 1_000_000 as Gas,
      fixedGasGas: 1_671_053 as Gas,
      //fixedGas: 635_000 as u<UST<number>>,
      airdropGasWanted: 300_000 as Gas,
      airdropGasGas: 334_211 as Gas,
      blocksPerYear: 4_656_810,
      gasAdjustment: 1.6 as Rate<number>,
    },
    bombay: {
      gasWanted: 1_000_000 as Gas,
      fixedGasGas: 1_671_053 as Gas,
      //fixedGas: 635_000 as u<UST<number>>,
      airdropGasWanted: 300_000 as Gas,
      airdropGasGas: 334_211 as Gas,
      blocksPerYear: 4_656_810,
      gasAdjustment: 1.6 as Rate<number>,
    },
  };

export const DEFAULT_ANCHOR_INDEXER_API_ENDPOINTS: Record<string, string> = {
  mainnet: 'https://api.anchorprotocol.com/api/v1',
  testnet: 'https://tequila-api.anchorprotocol.com/api/v1',
  // TODO change to bombay
  bombay: 'https://tequila-api.anchorprotocol.com/api/v1',
};

export const ANCHOR_SAFE_RATIO: Rate<number> = 0.75 as Rate<number>;
