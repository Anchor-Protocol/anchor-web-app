import React from 'react';
import { EvmWrongNetwork } from 'components/EvmWrongNetwork';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { Dashboard } from 'pages/dashboard';
import { Route, Routes, Navigate } from 'react-router-dom';
import { EvmAppProviders } from 'providers/evm/EvmAppProviders';
import { Earn } from 'pages/earn';
import { Borrow } from 'pages/borrow';
import { TermsOfService } from 'pages/terms';
import { Redeem } from 'pages/bridge/redeem';
import { Restore } from 'pages/bridge/restore';
import { Mypage } from 'pages/mypage';
import { ClaimAll } from 'pages/trade/claim.all';
import '../configurations/chartjs';

export function EvmApp() {
  return (
    <EvmAppProviders>
      <div>
        <GlobalStyle />
        <EvmWrongNetwork />
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/bridge/redeem/:sequence" element={<Redeem />} />
          <Route path="/bridge/restore" element={<Restore />} />
          <Route path={`/claim/all`} element={<ClaimAll />} />
          <Route element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </EvmAppProviders>
  );
}
