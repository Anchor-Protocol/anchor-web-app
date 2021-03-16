import { AddressMap } from '@anchor-protocol/anchor.js';
import { Rate } from '@anchor-protocol/types';

export const GA_TRACKING_ID = 'G-H42LRVHR5Y';

export const SENTRY_DSN =
  'https://f33dd06d6f5948bfb06d809d0d0a274c@o247107.ingest.sentry.io/5636828';

export const SAFE_RATIO: Rate<number> = 0.7 as Rate<number>;

export const onProduction =
  // TODO test url
  global.location.host === 'app-dev.anchorprotocol.com' ||
  global.location.host === 'app.anchorprotocol.com' ||
  global.location.host === 'app.anchor.money' ||
  global.location.host === 'app.anchor.market' ||
  global.location.host === 'anchorprotocol.com' ||
  global.location.host === 'anchor.money' ||
  global.location.host === 'anchor.market';

export const defaultNetwork = onProduction
  ? {
      chainID: 'columbus-4',
      fcd: 'https://fcd.terra.dev',
      lcd: 'https://lcd.terra.dev',
      name: 'mainnet',
      ws: 'wss://fcd.terra.dev',
    }
  : {
      chainID: 'tequila-0004',
      fcd: 'https://tequila-fcd.terra.dev',
      lcd: 'https://tequila-lcd.terra.dev',
      name: 'testnet',
      ws: 'wss://tequila-ws.terra.dev',
    };

export const columbusContractAddresses: AddressMap = {
  bLunaHub: 'terra1k73hw45p0j8kgzlwrmqetutpfkqzua20zea8sn',
  blunaToken: 'terra17wgmccdu57lx09yzhnnev39srqj7msg9ky2j76',
  blunaReward: 'terra1r5kka29lx76udy9j38xhp93mamrgxfhrwhx9zj',
  blunaAirdrop: 'terra1s7xkmg5puvzr6wy57g5ld6n2wtgm4frr7p6a4n',
  mmInterestModel: 'terra1ke7l45x65f5sm4rn695ufywstcxuqs6h6w0x4h',
  mmOracle: 'terra1t2vqvzzcwz4zpd7w7jdf8m9c5jctw5kcm9zqwg',
  mmMarket: 'terra17musy9up9gepvuvc7hm0macq8hf0j7mw74yaam',
  mmOverseer: 'terra1udpfqex2x2efq7jkx5s69s6wkf4uaeh07w2akc',
  mmCustody: 'terra1kylwyvu94hfktw2kse4hxm48vr0vjn0486wg9k',
  mmLiquidation: 'terra1c2qje62nl0ecj9uwg607se9nxgccu5aamdgw0d',
  mmDistributionModel: 'terra1mpdc8lqvc58tm90ee4atl8dqsdrpl9srylrmqk',
  aTerra: 'terra1hj2lwwxdnsncvaey6wwjjamujc9m205xktntnw',
  terraswapblunaLunaPair: 'terra15g3ecsr7xmz8q9uhtc0r340uj9eut4pg3umc9w',
  terraswapblunaLunaLPToken: 'terra1d5j958a4vrfmv20gddyp0gz0f6yx0kpd702qke',
  terraswapAncUstPair: 'terra1ahlfw40ruca9h64e2hylwfs75ems76mnfstv4x',
  terraswapAncUstLPToken: 'terra1079zf52uyn4hnxdrst38fvd9ga582xcjrmenw8',
  gov: 'terra17ukn8mxf9gnth26gufk49d4lzx03f9uzvmgeg6',
  distributor: 'terra1vg9gsrjtfx3w6zacr4c8utpgdsv4k42jnn3nxt',
  collector: 'terra1vd7uejpg8cx0ahfxkhpksrck93p4dq7jwdgfj8',
  community: 'terra1j0kc9f6kvu2y72w9ucl8tpts3ydz5cdudkj2p9',
  staking: 'terra1cuzrlvlpgxmc9ykj2yv0urj256xm4r62ygm7du',
  ANC: 'terra12nxvzzqv0yeh80z6eya0gcufyn36ntrkcalnjl',
  airdrop: 'terra1lwkmcfdwfyxq4hk0laty4l9xrp9mauxgt3ekr7',
  team: 'terra1n3yqyg8vgug9jq8eavlnt6cq2cyafgqtupugts',
  vesting: 'terra1yfueqrlw5lm8gxncw8f8fjl76n9wltyyr50sdj',
  terraswapFactory: '',
};

export const tequilaContractAddresses: AddressMap = {
  bLunaHub: 'terra1fflas6wv4snv8lsda9knvq2w0cyt493r8puh2e',
  blunaToken: 'terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x',
  blunaReward: 'terra1ac24j6pdxh53czqyrkr6ygphdeftg7u3958tl2',
  blunaAirdrop: 'terra1334h20c9ewxguw9p9vdxzmr8994qj4qu77ux6q',
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
  terraswapFactory: '',
  vesting: 'terra19f6ktw4qpjj9p9m49y8mhf6pr9807d44xdcus7',
  team: 'terra1x7ted5g0g6ntyqdaqmjwtzcctvvrdju49vs8pl',
};
