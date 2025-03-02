'use client';

import { useEffect } from 'react';

import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Card from '@/components/common/Card/Card';
import getPagenationItems from '@/components/common/Pagenation/apis/getPagenationItems';
import Pagination from '@/components/common/Pagenation/Pagenation';
import Skeleton from '@/components/common/Skeleton/Skeleton';
import { FILTER, LIMIT } from '@/components/page-layout/productListLayout/constants/index';
import styles from '@/components/page-layout/productListLayout/ProductList/ProductList.module.scss';
import FinishedItem from '@/components/page-layout/productListLayout/types/index';
import ROUTE from '@/constants/route';

const cn = classNames.bind(styles);

export default function ProductList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const page = Number(searchParams.get('page')) || 1;
  const selectedFilter = searchParams.get('filter') || 'all';

  const caffeine = searchParams.get('caffeine') || null;

  const season = searchParams.get('season') || null;

  const queryClient = useQueryClient();

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.replace(`${pathname}?${params}`);
  };

  const setSelectedFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('filter', filter);
    router.replace(`${pathname}?${params}`);
  };

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['items', page, selectedFilter, caffeine, season],
    queryFn: () => getPagenationItems(selectedFilter, page, LIMIT, caffeine, season),
    placeholderData: keepPreviousData,
  });

  const finishedData = data?.tea?.map((item: FinishedItem) => ({
    ...item,
    href: `${ROUTE.PRODUCT_LIST}/${item.id}`,
  }));

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
  };

  useEffect(() => {
    if (!isPlaceholderData && !data?.tea[0]?.lastPage) {
      queryClient.prefetchQuery({
        queryKey: ['items', page + 1, selectedFilter, caffeine, season],
        queryFn: () => getPagenationItems(selectedFilter, page + 1, LIMIT, caffeine, season),
      });
    }
  }, [isPlaceholderData, queryClient, page, caffeine, season, selectedFilter, data?.tea]);

  return (
    <div className={cn('main')}>
      <div className={cn('container')}>
        <div className={cn('filter')}>
          {FILTER.map((filter) => (
            <p
              key={filter.key}
              className={cn({ active: selectedFilter === filter.english })}
              onClick={() => handleFilterClick(filter.english)}
            >
              {filter.ko}
            </p>
          ))}
        </div>
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className={cn('skeleton')} />)
          : finishedData?.map((item: FinishedItem) => (
              <Card
                type="productList"
                key={item.id}
                id={item.id}
                img={item.img}
                href={item.href}
                price={item.price}
                scope={item.rating}
                review={item.review}
                title={item.nameEng}
                koTitle={item.name}
              />
            ))}
      </div>
      <Pagination currentPage={page} itemsPerPage={LIMIT} totalItems={data?.size} setPage={setPage} />
    </div>
  );
}
