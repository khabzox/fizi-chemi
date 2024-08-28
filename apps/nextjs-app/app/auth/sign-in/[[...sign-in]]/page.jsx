"use client";

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'

import Link from 'next/link';

import { ArrowRight } from 'lucide-react';


export default function SignInPage() {
  return (
    <SignIn.Root>
      <div className="flex flex-col justify-center items-center mx-auto my-8 max-w-md w-full">
        <SignIn.Step name="start" className="w-full p-4 rounded-lg">
          <div className="text-start pb-3 font-bold">
            <h1 className="text-primary text-2xl">Connectez-vous à votre compte</h1>
            <p className="pt-2">Pas de compte? <Link href={"/auth/sign-up"} className="underline font-medium text-secondary">Créer un</Link>
            </p>
          </div>

          <Clerk.Connection name="google" className="flex justify-center items-center font-medium gap-3 my-4 w-full py-2 text-center border-2 border-primary rounded-lg">
            <GoogleIcon height="18" width="22" /> Continuer avec Google
          </Clerk.Connection>

          <div className="flex justify-center items-center my-2">
            <div className="border rounded-xl border-primary grow"></div>
            <div className="px-5">or</div>
            <div className="border rounded-xl border-primary grow"></div>
          </div>

          <Clerk.Field name="identifier">
            <Clerk.Label>Email:</Clerk.Label>
            <Clerk.Input
              className="w-full my-1 p-2 border-2 border-primary rounded-lg bg-white placeholder:text-primary placeholder:opacity-70 focus:border-primary focus:outline-none"
              placeholder="example@gmail.com"
            />
            <Clerk.FieldError className="text-red-400 opacity-100" />
          </Clerk.Field>

          <SignIn.Action
            submit
            className="flex justify-center items-center gap-2 w-full mt-5 py-2 bg-primary text-white rounded-lg hover:opacity-95"
          >
            Continuer <ArrowRight size={20} />
          </SignIn.Action>
          <p className="py-3 px-5 text-sm text-center">En cliquant sur Continuer ou Se connecter, vous acceptez {" "}
            <Link href={"/sign-up"} className="underline font-medium text-secondary">Conditions Générales</Link>
            {" "} et {" "}
            <Link href={"/sign-up"} className="underline font-medium text-secondary">Politique de Confidentialité</Link>
          </p>
        </SignIn.Step>

        <SignIn.Step name="verifications">
          <SignIn.Strategy name="email_code">
            <h1>Vérifiez votre courrier électronique</h1>
            <p>Nous avons envoyé un code à <SignIn.SafeIdentifier />.</p>

            <Clerk.Field name="code" className="mt-5">
              <Clerk.Label>Code e-mail:</Clerk.Label>
              <Clerk.Input
                className="w-full my-1 p-2 border-2 border-primary rounded-lg bg-white placeholder:text-primary placeholder:opacity-70 focus:border-primary focus:outline-none"
              />
              <Clerk.FieldError className="text-red-400 opacity-100" />
            </Clerk.Field>

            <SignIn.Action
              submit
              className="flex justify-center items-center gap-2 w-full mt-5 py-2 bg-primary text-white rounded-lg hover:opacity-95"
            >Continuer</SignIn.Action>
          </SignIn.Strategy>
        </SignIn.Step>
      </div>
    </SignIn.Root>
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