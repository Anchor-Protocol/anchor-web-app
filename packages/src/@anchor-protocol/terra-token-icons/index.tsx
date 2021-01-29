import {
  ComponentType,
  DetailedHTMLProps,
  forwardRef,
  ImgHTMLAttributes,
} from 'react';
import styled from 'styled-components';
import AUT from './assets/AUT_TerraAUD.svg';
import CAT from './assets/CAT_TerraCAD.svg';
import CHT from './assets/CHT_TerraCHF.svg';
import CNT from './assets/CNT_TerraCNY.svg';
import EUT from './assets/EUT_TerraEUR.svg';
import GBT from './assets/GBT_TerraGBP.svg';
import HKT from './assets/HKT_TerraHKD.svg';
import INT from './assets/INT_TerraINR.svg';
import JPT from './assets/JPT_TerraJPY.svg';
import KRT from './assets/KRT_TerraKRW.svg';
import Luna from './assets/Luna.svg';
import MNT from './assets/MNT_TerraMNT.svg';
import SDT from './assets/SDT_TerraSDR.svg';
import SGT from './assets/SGT_TerraSGD.svg';
import UST from './assets/UST_TerraUSD.svg';

function createIcon(url: string): ComponentType {
  return forwardRef<
    HTMLImageElement,
    Omit<
      DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
      'src'
    >
  >((props, ref) => <Img {...props} ref={ref} src={url} />);
}

export const AUTIcon = createIcon(AUT);
export const CATIcon = createIcon(CAT);
export const CHTIcon = createIcon(CHT);
export const CNTIcon = createIcon(CNT);
export const EUTIcon = createIcon(EUT);
export const GBTIcon = createIcon(GBT);
export const HKTIcon = createIcon(HKT);
export const INTIcon = createIcon(INT);
export const JPTIcon = createIcon(JPT);
export const KRTIcon = createIcon(KRT);
export const LunaIcon = createIcon(Luna);
export const MNTIcon = createIcon(MNT);
export const SDTIcon = createIcon(SDT);
export const SGTIcon = createIcon(SGT);
export const USTIcon = createIcon(UST);

const Img = styled.img`
  width: 1em;
  height: 1em;
`;
