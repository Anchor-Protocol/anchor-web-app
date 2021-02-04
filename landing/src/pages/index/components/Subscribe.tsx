import { InputBase } from '@material-ui/core';
import { MailOutline } from '@material-ui/icons';
import { useMemo, useState } from 'react';
import styled from 'styled-components';

export interface SubscribeProps {
  className?: string;
}

function SubscribeBase({ className }: SubscribeProps) {
  const [email, setEmail] = useState<string>('');

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
      <div className="email">
        <MailOutline />
        <InputBase
          type="email"
          fullWidth
          placeholder="Enter Your email address"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
        />
        <button disabled={!validEmail} onClick={() => console.log(email)}>
          Subscribe
        </button>
      </div>
      <div className="links">
        <a href="#">CONTACT</a>
        <a href="#">WHITE PAPER</a>
        <a href="#">DISCORD</a>
        <a href="#">AGORA</a>
        <a href="#">Terra WEBSITE</a>
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

      padding: 4px 28px;

      border: none;
      outline: none;
      background-color: transparent;

      border-left: 1px solid #e2e2e2;
      color: #949494;

      &:hover {
        color: #777777;
      }

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
