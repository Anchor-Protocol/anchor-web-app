import React from 'react'
import AnchorLogo from './anchor-logo'
import Navigation from './navigation'
import Wallet from '../components/wallet'

interface LayoutProps {
  currentRoute: string
}

const DefaultLayout: React.FunctionComponent<LayoutProps> = ({
  currentRoute,
  children
}) => {
  return ( 
    <div>
      {/* header */}
      <section>
        <div>
          <AnchorLogo />
        </div>
        <div>
          <Navigation currentRoute={currentRoute}/>
          <Wallet/>
        </div>
      </section>
      {/* header end */}
      {/* content */}
      <section>
        {children}
      </section>
      {/* content end */}
      {/* footer */}
      <section>
        -
      </section>
      {/* footer end */}
    </div>
  )
}

export default DefaultLayout