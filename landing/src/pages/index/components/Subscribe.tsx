import { InputBase } from '@material-ui/core';
import { MailOutline } from '@material-ui/icons';
import { useSendinblueSubscription } from '@terra-dev/sendinblue';
import { links, sendinblueApiKey } from 'env';
import { useMemo, useState } from 'react';
import styled from 'styled-components';

export interface SubscribeProps {
  className?: string;
}

function SubscribeBase({ className }: SubscribeProps) {
  const [email, setEmail] = useState<string>('');

  const [subscribeEmail, { status }] = useSendinblueSubscription(
    sendinblueApiKey,
  );

  const validEmail = useMemo(() => {
    return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email,
    );
  }, [email]);

  return (
    <section className={className}>
      <p>
        Sign up for our newsletter to receive product news, updates and special
        invites.
      </p>
      {status === 'in-progress' ? (
        <div className="email">
          <MailOutline /> Please wait...
        </div>
      ) : status === 'success' ? (
        <div className="email">
          <MailOutline /> Thanks for subscribing.
        </div>
      ) : (
        <div className="email">
          <MailOutline />
          <InputBase
            type="email"
            fullWidth
            placeholder="Enter Your email address"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
          <button disabled={!validEmail} onClick={() => subscribeEmail(email)}>
            Subscribe
          </button>
        </div>
      )}
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
    color: ${({ theme }) => theme.textColor};

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
      color: ${({ theme }) => theme.textColor};

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
  }
`;
