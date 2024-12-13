import Head from 'next/head'
import type { NextPage } from 'next'

import AdvancedCreateSafe from '@/components/new-safe/create/AdvancedCreateSafe'

const Open: NextPage = () => {
  return (
    <main>
      <Head>
        <title>{'Metal L2 Safe – Advanced Safe creation'}</title>
      </Head>

      <AdvancedCreateSafe />
    </main>
  )
}

export default Open
