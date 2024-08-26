"use client";

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'

import Link from 'next/link';

import { ArrowRight } from 'lucide-react';


import Image from "next/image";

export default function SignInPage() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <Image
            alt=""
            src="/images/bg-sign-in-up-page.jpg"
            className="absolute inset-0 h-full w-full object-cover "
            fill
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
          <SignIn.Root>
      <div className="flex flex-col justify-center items-center mx-auto my-8 max-w-md w-full">
        <SignIn.Step name="start" className="w-full p-4 rounded-lg">
          <div className="text-start pb-3">
            <h1 className="text-accent text-2xl text-black"><b>Sign In to Your Account</b></h1>
            <p className="pt-2">No account? <Link href={"/sign-up"} className="underline font-medium text-secondary">Create one</Link>
            </p>
          </div>

          <Clerk.Connection
  name="google"
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '500',
    gap: '0.75rem',
    margin: '1rem 0',
    width: '100%',
    padding: '0.5rem 0',
    textAlign: 'center',
    borderWidth: '2.5px',
    borderColor: '#5800FF',
    borderRadius: '0.8rem',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent', // Initial background
    color: '#5800FF', // Initial text color
    position: 'relative',
    overflow: 'hidden',
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.backgroundColor = '#5800FF'; // Change to your move color
    e.currentTarget.style.color = 'white';
    e.currentTarget.style.transform = 'scale(1.05)';
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.backgroundColor = 'transparent'; // Reset to initial
    e.currentTarget.style.color = 'black';
    e.currentTarget.style.transform = 'scale(1)';
  }}
>
  <GoogleIcon height="20" width="22" /> Continue with Google
</Clerk.Connection>


<div className="flex justify-center items-center my-2">
  <div className="border-2 rounded-xl border-primary grow"></div>
  <div className="px-5">or</div>
  <div className="border-2 rounded-xl border-primary grow"></div>
</div>


<Clerk.Field name="identifier">
  <Clerk.Label>Email:</Clerk.Label>
  <Clerk.Input
    className="w-full my-1 p-2 border-2 border-primary rounded-lg bg- placeholder:text-[#312f35] placeholder:opacity-70 focus:border-[#5800FF] focus:outline-none"
    placeholder="example@gmail.com"
  />
  <Clerk.FieldError className="text-red-400 opacity-100" />
</Clerk.Field>


<SignIn.Action
  submit
  className="relative flex justify-center items-center gap-2 w-full mt-5 py-2 bg-[#5800FF] text-white border-2 border-[#5800FF] rounded-lg transition-all duration-300 hover:bg-secondary/90  hover:text-white /50 hover:gap-2 group"
>
  <span className="transition-all duration-300 group-hover:font-bold">
    Continue
  </span>
  <ArrowRight
    size={20}
    className="transition-transform duration-300 group-hover:translate-x-2"
  />
</SignIn.Action>





<div className="flex items-center py-3 px-5 text-sm text-center">
 
  <label htmlFor="terms-conditions" className="ml-1">
    By clicking Continue, you agree to {" "}
    <Link href={"/sign-up"} className="underline font-medium text-secondary" >Terms of Conditions</Link>
    {" "} and {" "}
    <Link href={"/sign-up"} className="underline font-medium text-secondary ">Privacy Policy</Link>
  </label>
</div>

        </SignIn.Step>

        <SignIn.Step name="verifications">
          <SignIn.Strategy name="email_code">
            <h1>Check Your Email</h1>
            <p>We sent a code to <SignIn.SafeIdentifier />.</p>

            <Clerk.Field name="code" className="mt-5">
              <Clerk.Label>Email code:</Clerk.Label>
              <Clerk.Input
                className="w-full my-1 p-2 border-2 border-accent rounded-lg bg-primary placeholder:text-accent placeholder:opacity-70 focus:border-accent focus:outline-none"
              />
              <Clerk.FieldError className="text-red-400 opacity-100" />
            </Clerk.Field>

            <SignIn.Action
              submit
              className="flex justify-center items-center gap-2 w-full mt-5 py-2 bg-accent text-white rounded-lg hover:opacity-95"
            >Continue</SignIn.Action>
          </SignIn.Strategy>
        </SignIn.Step>
      </div>
    </SignIn.Root>
          </div>
        </main>
      </div>
    </section>
  );
}
function GoogleIcon(props) {
    return (
      <svg width={props.width || 31} height={props.height || 31} viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className} {...props}>
        <path d="M30.6985 12.4643H29.45V12.4H15.5V18.6H24.2598C22.9818 22.2092 19.5478 24.8 15.5 24.8C10.3641 24.8 6.2 20.6359 6.2 15.5C6.2 10.3641 10.3641 6.2 15.5 6.2C17.8707 6.2 20.0275 7.09435 21.6698 8.55522L26.0539 4.17105C23.2856 1.59107 19.5827 0 15.5 0C6.94012 0 0 6.94012 0 15.5C0 24.0599 6.94012 31 15.5 31C24.0599 31 31 24.0599 31 15.5C31 14.4607 30.893 13.4462 30.6985 12.4643Z" fill="#FFC107" />
        <path d="M1.78711 8.28553L6.87963 12.0203C8.25758 8.6087 11.5947 6.2 15.5 6.2C17.8707 6.2 20.0275 7.09435 21.6697 8.55523L26.0539 4.17105C23.2856 1.59108 19.5827 0 15.5 0C9.54641 0 4.38336 3.36118 1.78711 8.28553Z" fill="#FF3D00" />
        <path d="M15.5 31C19.5037 31 23.1415 29.4678 25.892 26.9762L21.0948 22.9167C19.5386 24.0955 17.6042 24.8 15.5 24.8C11.4685 24.8 8.04532 22.2293 6.75572 18.6418L1.70117 22.5362C4.26642 27.5559 9.47597 31 15.5 31Z" fill="#4CAF50" />
        <path d="M30.6985 12.4643H29.45V12.4H15.5V18.6H24.2598C23.646 20.3337 22.5308 21.8286 21.0924 22.9175L21.0947 22.916L25.892 26.9754C25.5525 27.2839 31 23.25 31 15.5C31 14.4607 30.893 13.4462 30.6985 12.4643Z" fill="#1976D2" />
      </svg>
    )
  }