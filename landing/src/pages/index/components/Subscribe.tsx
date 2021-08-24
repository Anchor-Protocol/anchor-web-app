//import { useEmailInput, useSendinblueSubscription } from '@libs/sendinblue';
//import { InputBase } from '@material-ui/core';
//import { MailOutline } from '@material-ui/icons';
import { links } from 'env';
import styled from 'styled-components';

export interface SubscribeProps {
  className?: string;
}

function SubscribeBase({ className }: SubscribeProps) {
  //const [email, setEmail, validEmail] = useEmailInput();
  //
  //const [subscribeEmail, { status }] = useSendinblueSubscription('EMPTY');

  // TODO Remove until security check

  return (
    <section className={className}>
      {/*<p>*/}
      {/*  Sign up for our newsletter to receive product news, updates and special*/}
      {/*  invites.*/}
      {/*</p>*/}
      {/*{status === 'in-progress' ? (*/}
      {/*  <div className="email">*/}
      {/*    <MailOutline /> Please wait...*/}
      {/*  </div>*/}
      {/*) : status === 'success' ? (*/}
      {/*  <div className="email">*/}
      {/*    <MailOutline /> Thanks for subscribing.*/}
      {/*  </div>*/}
      {/*) : (*/}
      {/*  <div className="email">*/}
      {/*    <MailOutline />*/}
      {/*    <InputBase*/}
      {/*      type="email"*/}
      {/*      fullWidth*/}
      {/*      placeholder="Enter Your email address"*/}
      {/*      value={email}*/}
      {/*      onChange={({ target }) => setEmail(target.value)}*/}
      {/*    />*/}
      {/*    <button disabled={!validEmail} onClick={() => subscribeEmail(email)}>*/}
      {/*      Subscribe*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*)}*/}
      <div className="links">
        <a href={links.contact} target="_blank" rel="noreferrer">
          CONTACT
        </a>
        <a href={links.whitepaper} target="_blank" rel="noreferrer">
          WHITE PAPER
        </a>
        <a href={links.discord} target="_blank" rel="noreferrer">
          DISCORD
        </a>
        <a href={links.forum} target="_blank" rel="noreferrer">
          FORUM
        </a>
        <a href={links.terra} target="_blank" rel="noreferrer">
          Terra WEBSITE
        </a>
      </div>
    </section>
  );
}

export const Subscribe = styled(SubscribeBase)`
  margin: 80px 40px;

  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    font-size: 17px;
    color: rgba(0, 0, 0, 0.5);
  }

  .email {
    font-size: 17px;
    color: #1f1f1f;

    margin-top: 24px;

    display: flex;
    height: 70px;

    padding: 0 5px 0 30px;
    align-items: center;

    border-radius: 4px;

    width: 100%;
    max-width: 860px;

    background-color: #f6f6f6;

    svg {
      color: #cccccc;
      font-size: 20px;
      margin-right: 15px;
      transform: translateY(1px);
    }

    input::placeholder {
      color: #cccccc;
      opacity: 1;
    }

    button {
      cursor: pointer;

      width: 130px;

      border: 0;
      outline: none;
      background-color: transparent;

      padding: 4px 28px;
      border-radius: 0;

      border-left: 1px solid #e2e2e2;
      color: #1f1f1f;

      &:disabled {
        cursor: default;
        color: #b5b5b5;
      }
    }
  }

  .links {
    margin-top: 52px;

    display: flex;

    a {
      text-decoration: none;

      color: rgba(0, 0, 0, 0.35);
      font-size: 12px;
      font-weight: 700;

      &:not(:last-child) {
        margin-right: 35px;
      }

      &:hover {
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }

  @media (max-width: 600px) {
    .links {
      align-self: flex-start;

      flex-direction: column;

      a {
        text-align: left;

        &:not(:last-child) {
          margin-bottom: 24px;
        }
      }
    }

    .email {
      font-size: 13px;
      padding: 0 5px 0 15px;

      svg {
        font-size: 18px;
        margin-right: 5px;
      }

      input::placeholder {
        font-size: 13px;
        letter-spacing: -0.2px;
      }

      button {
        font-size: 13px;
        letter-spacing: -0.3px;
        width: 90px;
        padding: 4px 10px;
      }
    }
  }
`;
