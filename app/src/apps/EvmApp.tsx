import React from 'react';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { Dashboard } from 'pages/dashboard';
import { Route, Routes, Navigate } from 'react-router-dom';
import { EvmAppProviders } from 'providers/evm/EvmAppProviders';
import { Earn } from 'pages/earn';
import { TermsOfService } from 'pages/terms';
import { Redeem } from 'pages/bridge/redeem';
import { Mypage } from 'pages/mypage';
import { ClaimAll } from 'pages/trade/claim.all';
import '../configurations/chartjs';

export function EvmApp() {
  return (
    <EvmAppProviders>
      <div>
        <GlobalStyle />
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/bridge/redeem/:sequence" element={<Redeem />} />
          <Route path={`/claim/all`} element={<ClaimAll />} />
          <Route element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </EvmAppProviders>
  );
}
