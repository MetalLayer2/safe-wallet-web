import DataManagement from '@/components/settings/DataManagement'
import SettingsHeader from '@/components/settings/SettingsHeader'
import type { NextPage } from 'next'
import Head from 'next/head'

const Data: NextPage = () => {
  return (
    <>
      <Head>
        <title>Metal L2 Safe – Settings – Data</title>
      </Head>

      <SettingsHeader />

      <main>
        <DataManagement />
      </main>
    </>
  )
}

export default Data
