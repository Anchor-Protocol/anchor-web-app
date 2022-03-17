import React from 'react';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { Dashboard } from 'pages/dashboard';
import { Route, Routes, Navigate } from 'react-router-dom';
import { EvmAppProviders } from 'providers/evm/EvmAppProviders';
import { Earn } from 'pages/earn';
import { Borrow } from 'pages/borrow';
import { TermsOfService } from 'pages/terms';
import { Restore } from 'pages/bridge/restore';
import { Mypage } from 'pages/mypage';
import { ClaimAll } from 'pages/trade/claim.all';
import '../configurations/chartjs';
import { BackgroundTransactions } from 'components/Header/transactions/BackgroundTransactions';
import { PollDetail } from 'pages/gov/poll.detail';
import { GovernanceMain } from 'pages/gov/main';

export function EvmApp() {
  return (
    <EvmAppProviders>
      <div>
        <GlobalStyle />
        <Header />
        <Routes>
          <Route index={true} element={<Dashboard />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/gov/" element={<GovernanceMain />} />
          <Route path="/poll/:id" element={<PollDetail />} />
          <Route path="/bridge/restore" element={<Restore />} />
          <Route path="/claim/all" element={<ClaimAll />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BackgroundTransactions />
      </div>
    </EvmAppProviders>
  );
}
