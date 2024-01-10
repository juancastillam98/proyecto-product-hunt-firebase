import { Roboto, PT_Sans } from 'next/font/google'

import Link from "next/link";
import {Header} from "../components/Header";
import {GlobalStyles} from "../styles/GlobalStyles";
import 'normalize.css/normalize.css';
import {FirebaseProvider} from "../context/FirebaseProvider";

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin']
})
const pt_sans = PT_Sans({
  weight: ['400', '700'],
  subsets: ["latin"]
})

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
    <FirebaseProvider>

      <body className={pt_sans.className}>
        <GlobalStyles />

          <Header/>
          <main>
              {children}
          </main>
      </body>
    </FirebaseProvider>
    </html>
  )
}
