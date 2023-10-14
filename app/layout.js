import './globals.css'
import { Inter } from 'next/font/google'
import Provider from '@/SessionProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Güneş Özdemir',
  description: "Bu site, Güneş Özdemir'in ani defteridir. ",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <Provider>
        <Navbar />
        {children}
        </Provider>
        <Footer />
        </body>
    </html>
  )
}
