import React from 'react';
import {Adsense} from '@ctrl/react-adsense';
import Head from 'next/head';

export default function AdSense1 (){
    return(
        <>
            <Head>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9165545721062643"></script>
            </Head>
            <Adsense
                client="ca-pub-9165545721062643"
                slot="2688570370"
                style={{ display: 'block' }}
                layout="in-article"
                format="auto"
            />
        </>
    )
}
