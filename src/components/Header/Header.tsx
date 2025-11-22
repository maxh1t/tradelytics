'use client'

import { AuthButton, AuthButtonProps, SignInModal, SignInModalTrigger, SignOutButton } from '@coinbase/cdp-react'
import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useState } from 'react'

import Logo from '@/public/logo.svg'
import { useHyperliquidStore } from '@/src/stores/hyperliquid'

import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { FieldGroup, Field, FieldLabel, FieldError } from '../ui/field'
import { Input } from '../ui/input'

export function Header() {
  const {
    clearinghouseState,
    setPrivateKey,
    setWalletAddress,
    init,
    error,
    disconnect,
    loading: HLLoading,
  } = useHyperliquidStore()

  const [hlAddress, setHlAddress] = useState('')
  const [hlSecret, setHlSecret] = useState('')

  const handleHLConnect = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setWalletAddress(hlAddress)
    setPrivateKey(hlSecret)
    init()
    setHlAddress('')
    setHlSecret('')
  }

  return (
    <nav className='flex justify-between items-center h-12 px-4 border-b bg-white'>
      <Link href='/' className='flex items-center gap-2'>
        <Image src={Logo} alt='logo' />
        <div className='text-base font-semibold'>Tradelytics</div>
      </Link>

      <div className='flex items-center gap-3'>
        <AuthButton placeholder={SmallPlaceholder} signInModal={SmallSignInModal} signOutButton={SmallSignOutButton} />

        {HLLoading ? (
          <Button size='sm' variant='outline' disabled>
            Connecting…
          </Button>
        ) : clearinghouseState ? (
          <Button size='sm' variant='outline' onClick={disconnect}>
            Disconnect HL
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button size='sm'>Connect HL</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect HyperLiquid</DialogTitle>
                <DialogDescription>
                  <Link
                    href='https://help.cornix.io/en/articles/11010094-how-to-create-api-keys-hyperliquid'
                    target='_blank'
                    className='underline text-blue-600'
                  >
                    How to generate an API key
                  </Link>
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleHLConnect}>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Account Wallet Address</FieldLabel>
                    <Input required value={hlAddress} onChange={(e) => setHlAddress(e.target.value)} />
                  </Field>

                  <Field>
                    <FieldLabel>API Private Key</FieldLabel>
                    <Input required value={hlSecret} onChange={(e) => setHlSecret(e.target.value)} />
                  </Field>

                  {error && <FieldError>{error}</FieldError>}

                  <div className='flex gap-2 mt-3'>
                    <Button type='submit'>Submit</Button>
                    <DialogClose asChild>
                      <Button variant='outline'>Cancel</Button>
                    </DialogClose>
                  </div>
                </FieldGroup>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </nav>
  )
}

const SmallPlaceholder: AuthButtonProps['placeholder'] = () => (
  <Button disabled size='sm'>
    Connecting…
  </Button>
)

const SmallSignInModal: AuthButtonProps['signInModal'] = (props) => (
  <SignInModal {...props}>
    <SignInModalTrigger>
      <Button size='sm'>Sign in</Button>
    </SignInModalTrigger>
  </SignInModal>
)

const SmallSignOutButton: AuthButtonProps['signOutButton'] = (props) => (
  <SignOutButton {...props} asChild>
    <Button size='sm' variant='outline'>
      Sign out
    </Button>
  </SignOutButton>
)
