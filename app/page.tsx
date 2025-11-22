'use client'
import { AuthButton } from '@coinbase/cdp-react/components/AuthButton'
import { useIsSignedIn } from '@coinbase/cdp-hooks'

export default function Home() {
  const { isSignedIn } = useIsSignedIn()

  return (
    <div>
      {isSignedIn ? (
        <div>
          Welcome! You're signed in. <AuthButton />
        </div>
      ) : (
        <div>
          <h2>Please sign in</h2>
          <AuthButton />
        </div>
      )}
    </div>
  )
}
