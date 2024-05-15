import React, { useEffect } from 'react';
import Head from 'next/head';

declare global {
    interface Window {
        adsbygoogle: any;
    }
}

const AdsComponent = () => {

    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
        }
    }, []);

    return (
        <>
            <Head>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9165545721062643"></script>
            </Head>
            <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-9165545721062643"
                data-ad-slot="2688570370"
                data-ad-format="auto"
                data-full-width-responsive="true">
            </ins>
        </>
    );
};

export default AdsComponent;
