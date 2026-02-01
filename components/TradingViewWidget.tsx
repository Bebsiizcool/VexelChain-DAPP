import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise: Promise<void> | null = null;

interface TradingViewWidgetProps {
    symbol: string;
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ symbol }) => {
    const onLoadScriptRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        onLoadScriptRef.current = createWidget;

        if (!tvScriptLoadingPromise) {
            tvScriptLoadingPromise = new Promise((resolve) => {
                const script = document.createElement('script');
                script.id = 'tradingview-widget-loading-script';
                script.src = 'https://s3.tradingview.com/tv.js';
                script.type = 'text/javascript';
                script.onload = () => resolve();

                document.head.appendChild(script);
            });
        }

        tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

        return () => {
            onLoadScriptRef.current = null;
        };
    }, [symbol]);

    const createWidget = () => {
        if (document.getElementById('tradingview_widget_container') && 'TradingView' in window) {
            new (window as any).TradingView.widget({
                autosize: true,
                symbol: symbol, // Use exact symbol passed from prop
                interval: "D",
                timezone: "Etc/UTC",
                theme: "dark",
                style: "1",
                locale: "en",
                toolbar_bg: "#f1f3f6",
                enable_publishing: false,
                allow_symbol_change: true,
                container_id: "tradingview_widget_container",
                backgroundColor: "rgba(11, 14, 20, 1)", // Matching our bg
                gridColor: "rgba(255, 255, 255, 0.05)",
            });
        }
    };

    return (
        <div className='tradingview-widget-container h-[500px] w-full rounded-2xl overflow-hidden border border-white/10'>
            <div id='tradingview_widget_container' className='h-full w-full' />
        </div>
    );
};
