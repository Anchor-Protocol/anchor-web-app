import React from "react"
import { Switch, Route, RouteProps, Redirect } from "react-router-dom"
import BassetBurn from "./pages/basset/burn"
import BassetClaim from "./pages/basset/claim"
import BassetMint from "./pages/basset/mint"
import Borrow from "./pages/borrow"
import Earn from "./pages/earn"

export const routes: { [path: string]: RouteProps } = {
  bassetMint: { path: '/basset/mint', component: BassetMint },
  bassetBurn: { path: '/basset/burn', component: BassetBurn },
  bassetClaim: { path: '/basset/claim', component: BassetClaim },
  earn: { path: '/earn', component: Earn },
  borrow: { path: '/borrow', component: Borrow },
  // dashboard: {path: '/dashboard', component: Dashboard }
}

const Routes: React.FunctionComponent = () => {
  return (
    <Switch>
      {Object.entries(routes).map(([key, route]) => (
        <Route path={route.path} {...route} key={key}/>
      ))}

      <Redirect to="/"/>
    </Switch>
  )
}

export default Routes