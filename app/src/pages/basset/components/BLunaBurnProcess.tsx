import { Info, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { fixHMR } from 'fix-hmr';
import React, { CSSProperties } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import styled from 'styled-components';

export interface BLunaBurnProcessProps {
  className?: string;
  style?: CSSProperties;
}

function Component({ className, style }: BLunaBurnProcessProps) {
  const [show, setShow] = useLocalStorage<'on' | 'off'>(
    '__anchor_show_burn_process__',
    'off',
  );

  return (
    <div className={className} style={style}>
      <h4 onClick={() => setShow(show === 'on' ? 'off' : 'on')}>
        <Info /> bLuna Burn Process{' '}
        {show === 'on' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </h4>

      {show === 'on' && <Content />}
    </div>
  );
}

const StyledComponent = styled(Component)`
  h4 {
    font-size: 14px;

    cursor: pointer;

    svg {
      font-size: 1em;
      transform: translateY(0.1em);
    }
  }

  article {
    margin-top: 20px;

    font-size: 12px;

    svg {
      max-width: 100%;
    }

    h5 {
      margin-top: 24px;

      font-size: 1em;
      margin-bottom: 8px;
    }

    ul {
      padding-left: 14px;
      line-height: 1.6;
    }
  }
`;

export const BLunaBurnProcess = fixHMR(StyledComponent);

function Content() {
  return (
    <article>
      <svg viewBox="0 0 459 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 8H54C57.3137 8 60 10.6863 60 14C60 17.3137 57.3137 20 54 20H0V8Z"
          fill="var(--pending-color)"
        />
        <path
          d="M60 14C60 10.6863 62.6863 8 66 8H454V20H66C62.6863 20 60 17.3137 60 14Z"
          fill="var(--unbonding-color)"
        />
        <circle cx="453" cy="14" r="6" fill="var(--withdrawable-color)" />
        <path
          d="M0.169922 43.0001H1.64592V40.3001H3.31392C5.16192 40.3001 6.67392 39.3161 6.67392 37.4321V37.4081C6.67392 35.7161 5.44992 34.6001 3.48192 34.6001H0.169922V43.0001ZM1.64592 38.9681V35.9441H3.36192C4.46592 35.9441 5.17392 36.4601 5.17392 37.4441V37.4681C5.17392 38.3441 4.47792 38.9681 3.36192 38.9681H1.64592Z"
          fill="var(--pending-color)"
        />
        <path
          d="M7.88555 43.0001H14.1735V41.6801H9.36155V39.4361H13.5735V38.1041H9.36155V35.9201H14.1135V34.6001H7.88555V43.0001Z"
          fill="var(--pending-color)"
        />
        <path
          d="M15.6246 43.0001H17.0766V37.0241L21.7086 43.0001H22.9446V34.6001H21.4926V40.4081L16.9926 34.6001H15.6246V43.0001Z"
          fill="var(--pending-color)"
        />
        <path
          d="M24.8051 43.0001H27.9371C30.5771 43.0001 32.4011 41.1641 32.4011 38.8001V38.7761C32.4011 36.4121 30.5771 34.6001 27.9371 34.6001H24.8051V43.0001ZM27.9371 35.9441C29.7011 35.9441 30.8531 37.1561 30.8531 38.8001V38.8241C30.8531 40.4681 29.7011 41.6561 27.9371 41.6561H26.2811V35.9441H27.9371Z"
          fill="var(--pending-color)"
        />
        <path
          d="M33.9758 43.0001H35.4518V34.6001H33.9758V43.0001Z"
          fill="var(--pending-color)"
        />
        <path
          d="M37.4004 43.0001H38.8524V37.0241L43.4844 43.0001H44.7204V34.6001H43.2684V40.4081L38.7684 34.6001H37.4004V43.0001Z"
          fill="var(--pending-color)"
        />
        <path
          d="M50.5649 43.1441C52.0529 43.1441 53.2409 42.5441 54.0689 41.8361V38.3081H50.4929V39.6041H52.6409V41.1641C52.1249 41.5481 51.4049 41.8001 50.6129 41.8001C48.8969 41.8001 47.7569 40.5281 47.7569 38.8001V38.7761C47.7569 37.1681 48.9329 35.8241 50.4809 35.8241C51.5489 35.8241 52.1849 36.1721 52.8329 36.7121L53.7689 35.5961C52.9049 34.8641 52.0049 34.4561 50.5409 34.4561C48.0089 34.4561 46.2089 36.4481 46.2089 38.8001V38.8241C46.2089 41.2721 47.9369 43.1441 50.5649 43.1441Z"
          fill="var(--pending-color)"
        />
        <path
          d="M203.738 43.1321C205.934 43.1321 207.35 41.8721 207.35 39.3641V34.6001H205.874V39.4361C205.874 40.9841 205.07 41.7641 203.762 41.7641C202.442 41.7641 201.638 40.9361 201.638 39.3761V34.6001H200.162V39.4361C200.162 41.8721 201.554 43.1321 203.738 43.1321Z"
          fill="var(--unbonding-color)"
        />
        <path
          d="M209.076 43.0001H210.528V37.0241L215.16 43.0001H216.396V34.6001H214.944V40.4081L210.444 34.6001H209.076V43.0001Z"
          fill="var(--unbonding-color)"
        />
        <path
          d="M218.257 43.0001H222.145C224.017 43.0001 225.253 42.1961 225.253 40.6961V40.6721C225.253 39.5321 224.569 38.9681 223.585 38.6321C224.209 38.3081 224.785 37.7681 224.785 36.7601V36.7361C224.785 36.1841 224.593 35.7161 224.221 35.3441C223.741 34.8641 222.985 34.6001 222.025 34.6001H218.257V43.0001ZM223.309 37.0001C223.309 37.7681 222.673 38.1401 221.725 38.1401H219.709V35.9081H221.833C222.781 35.9081 223.309 36.3161 223.309 36.9761V37.0001ZM223.777 40.5161V40.5401C223.777 41.2961 223.153 41.6921 222.157 41.6921H219.709V39.3881H222.049C223.213 39.3881 223.777 39.8081 223.777 40.5161Z"
          fill="var(--unbonding-color)"
        />
        <path
          d="M230.613 43.1441C233.193 43.1441 235.017 41.1641 235.017 38.8001V38.7761C235.017 36.4121 233.217 34.4561 230.637 34.4561C228.057 34.4561 226.233 36.4361 226.233 38.8001V38.8241C226.233 41.1881 228.033 43.1441 230.613 43.1441ZM230.637 41.7761C228.969 41.7761 227.781 40.4321 227.781 38.8001V38.7761C227.781 37.1441 228.945 35.8241 230.613 35.8241C232.281 35.8241 233.469 37.1681 233.469 38.8001V38.8241C233.469 40.4561 232.305 41.7761 230.637 41.7761Z"
          fill="var(--unbonding-color)"
        />
        <path
          d="M236.5 43.0001H237.952V37.0241L242.584 43.0001H243.82V34.6001H242.368V40.4081L237.868 34.6001H236.5V43.0001Z"
          fill="var(--unbonding-color)"
        />
        <path
          d="M245.681 43.0001H248.813C251.453 43.0001 253.277 41.1641 253.277 38.8001V38.7761C253.277 36.4121 251.453 34.6001 248.813 34.6001H245.681V43.0001ZM248.813 35.9441C250.577 35.9441 251.729 37.1561 251.729 38.8001V38.8241C251.729 40.4681 250.577 41.6561 248.813 41.6561H247.157V35.9441H248.813Z"
          fill="var(--unbonding-color)"
        />
        <path
          d="M254.852 43.0001H256.328V34.6001H254.852V43.0001Z"
          fill="var(--unbonding-color)"
        />
        <path
          d="M258.276 43.0001H259.728V37.0241L264.36 43.0001H265.596V34.6001H264.144V40.4081L259.644 34.6001H258.276V43.0001Z"
          fill="var(--unbonding-color)"
        />
        <path
          d="M271.441 43.1441C272.929 43.1441 274.117 42.5441 274.945 41.8361V38.3081H271.369V39.6041H273.517V41.1641C273.001 41.5481 272.281 41.8001 271.489 41.8001C269.773 41.8001 268.633 40.5281 268.633 38.8001V38.7761C268.633 37.1681 269.809 35.8241 271.357 35.8241C272.425 35.8241 273.061 36.1721 273.709 36.7121L274.645 35.5961C273.781 34.8641 272.881 34.4561 271.417 34.4561C268.885 34.4561 267.085 36.4481 267.085 38.8001V38.8241C267.085 41.2721 268.813 43.1441 271.441 43.1441Z"
          fill="var(--unbonding-color)"
        />
        <path
          d="M358.783 43.06H360.067L362.131 37.024L364.195 43.06H365.479L368.395 34.6H366.847L364.843 40.828L362.779 34.576H361.531L359.467 40.828L357.463 34.6H355.867L358.783 43.06Z"
          fill="var(--withdrawable-color)"
        />
        <path
          d="M369.694 43H371.17V34.6H369.694V43Z"
          fill="var(--withdrawable-color)"
        />
        <path
          d="M375.17 43H376.646V35.968H379.322V34.6H372.494V35.968H375.17V43Z"
          fill="var(--withdrawable-color)"
        />
        <path
          d="M380.553 43H382.029V39.46H386.037V43H387.513V34.6H386.037V38.092H382.029V34.6H380.553V43Z"
          fill="var(--withdrawable-color)"
        />
        <path
          d="M389.37 43H392.502C395.142 43 396.966 41.164 396.966 38.8V38.776C396.966 36.412 395.142 34.6 392.502 34.6H389.37V43ZM392.502 35.944C394.266 35.944 395.418 37.156 395.418 38.8V38.824C395.418 40.468 394.266 41.656 392.502 41.656H390.846V35.944H392.502Z"
          fill="var(--withdrawable-color)"
        />
        <path
          d="M398.457 43H399.933V40.072H401.781L403.845 43H405.597L403.329 39.82C404.493 39.484 405.321 38.656 405.321 37.276V37.252C405.321 36.52 405.069 35.896 404.625 35.44C404.085 34.912 403.257 34.6 402.201 34.6H398.457V43ZM399.933 38.764V35.944H402.081C403.173 35.944 403.821 36.436 403.821 37.336V37.36C403.821 38.212 403.149 38.764 402.093 38.764H399.933Z"
          fill="var(--withdrawable-color)"
        />
        <path
          d="M406.108 43H407.62L408.484 40.972H412.456L413.308 43H414.868L411.172 34.54H409.804L406.108 43ZM409.024 39.664L410.464 36.304L411.916 39.664H409.024Z"
          fill="var(--withdrawable-color)"
        />
        <path
          d="M417.199 43.06H418.483L420.547 37.024L422.611 43.06H423.895L426.811 34.6H425.263L423.259 40.828L421.195 34.576H419.947L417.883 40.828L415.879 34.6H414.283L417.199 43.06Z"
          fill="var(--withdrawable-color)"
        />
        <path
          d="M426.227 43H427.739L428.603 40.972H432.575L433.427 43H434.987L431.291 34.54H429.923L426.227 43ZM429.143 39.664L430.583 36.304L432.035 39.664H429.143Z"
          fill="var(--withdrawable-color)"
        />
        <path
          d="M436.128 43H440.016C441.888 43 443.124 42.196 443.124 40.696V40.672C443.124 39.532 442.44 38.968 441.456 38.632C442.08 38.308 442.656 37.768 442.656 36.76V36.736C442.656 36.184 442.464 35.716 442.092 35.344C441.612 34.864 440.856 34.6 439.896 34.6H436.128V43ZM441.18 37C441.18 37.768 440.544 38.14 439.596 38.14H437.58V35.908H439.704C440.652 35.908 441.18 36.316 441.18 36.976V37ZM441.648 40.516V40.54C441.648 41.296 441.024 41.692 440.028 41.692H437.58V39.388H439.92C441.084 39.388 441.648 39.808 441.648 40.516Z"
          fill="var(--withdrawable-color)"
        />
        <path
          d="M444.488 43H450.38V41.656H445.964V34.6H444.488V43Z"
          fill="var(--withdrawable-color)"
        />
        <path
          d="M451.606 43H457.894V41.68H453.082V39.436H457.294V38.104H453.082V35.92H457.834V34.6H451.606V43Z"
          fill="var(--withdrawable-color)"
        />
        <rect x="452" width="2" height="28" fill="var(--withdrawable-color)" />
        <rect width="2" height="28" fill="var(--pending-color)" />
        <line
          x1="60.5"
          y1="2.18557e-08"
          x2="60.5"
          y2="28"
          stroke="var(--unbonding-color)"
          strokeDasharray="2 2"
        />
      </svg>

      <h5>Pending:</h5>

      <ul>
        <li>
          Burn requests are processed in 3-day batches. Only when this batch is
          created, will the unbonding process actually begin.
        </li>
        <li>
          Burn requests that are yet to be included in a batch are marked as
          pending.
        </li>
      </ul>

      <h5>Unbonding:</h5>

      <ul>
        <li>
          The bond request has been made, and bLuna withdrawable time is
          calculable.
        </li>
        <li>Requested time : The time the bonding request has been made.</li>
        <li>
          Withdrawable time : The time the unbonded bLuna will become
          withdrawable as Luna.
        </li>
      </ul>

      <h5>Withdrawable:</h5>

      <ul>
        <li>
          bLuna has completed the unbonding process, and is now withdrawable.
        </li>
      </ul>
    </article>
  );
}
