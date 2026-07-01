import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { getTopCrypto } from '../../actions/cryptoApi'
import { AssetsTable } from '../../../components/AssetsTable'
import { Pagination } from '../../../components/Pagination'

export default async function CryptoPage({
    params,
    searchParams
}: {
    params: { locale: string }
    searchParams: { page?: string }
}) {
    const { locale } = await params
    setRequestLocale(locale)

    const resolvedSearchParams = await searchParams
    const currentPage = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page, 10) : 1

    const t = await getTranslations('Dashboard')

    const apiPage = Math.ceil(currentPage / 10)
    const topCrypto100 = await getTopCrypto(apiPage)

    const localPageIndex = (currentPage - 1) % 10
    const topCrypto = topCrypto100.slice(localPageIndex * 10, localPageIndex * 10 + 10)

    const hasNextPage = topCrypto.length === 10
    const startIndex = (currentPage - 1) * 10 + 1

    return (
        <div className="flex flex-col w-full">
            <AssetsTable title={t('topCrypto')} assets={topCrypto} type="crypto" startIndex={startIndex} />
            <Pagination currentPage={currentPage} hasNextPage={hasNextPage} />
        </div>
    )
}
