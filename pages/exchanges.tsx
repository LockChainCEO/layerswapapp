import Swap from '../components/swapComponent'
import Layout from '../components/layout'
import LayerSwapApiClient from '../lib/layerSwapApiClient'
import { InferGetServerSidePropsType } from 'next'
import { CryptoNetwork } from '../Models/CryptoNetwork'
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useEffect, useState } from 'react'
import NavRadio, { NavRadioOption } from '../components/navRadio'
import Banner from '../components/banner'
import { SettingsProvider } from '../context/settings'
import { QueryProvider } from '../context/query'
import { AccountProvider } from '../context/account'
import { AuthProvider } from '../context/auth'
import UserExchanges from '../components/exchangesComponent'
import LayerswapMenu from '../components/LayerswapMenu'


const swapOptions: NavRadioOption[] = [
    { name: "onramp", displayName: 'On-ramp', isEnabled: true, isNew: false },
    { name: "offramp", displayName: 'Off-ramp', isEnabled: true, isNew: true }
];

export default function Home({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {


    return (
        <Layout>
            <div className="flex content-center items-center justify-center mb-5 space-y-5 flex-col  container mx-auto sm:px-6 lg:px-8 max-w-3xl">
                <div className='flex flex-col space-y-5'>
                   
                    <SettingsProvider data={data}>
                        <AuthProvider>
                            <UserExchanges />
                        </AuthProvider>
                    </SettingsProvider>
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    context.res.setHeader(
        'Cache-Control',
        's-maxage=60, stale-while-revalidate'
    );

    var query = context.query;
    var apiClient = new LayerSwapApiClient();
    const data = await apiClient.fetchSettingsAsync()
    var networks: CryptoNetwork[] = [];
    if (!process.env.IS_TESTING) {
        data.networks.forEach((element) => {
            if (!element.is_test_net) networks.push(element);
        });
    }
    else {
        networks = data.networks;
    }

    data.networks = networks;
    let isOfframpEnabled = process.env.OFFRAMP_ENABLED != undefined && process.env.OFFRAMP_ENABLED == "true";

    return {
        props: { data, query, isOfframpEnabled },
    }
}