import React, { useState, useEffect } from 'react';

type Category = 'Crypto' | 'Forex' | 'Finance' | 'Indexes' | 'Interest Rate';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    thumbnail: string;
    source: string;
    category: Category;
}

const CATEGORY_FEEDS: Record<Category, { url: string; sourceName: string }[]> = {
    'Crypto': [
        { url: 'https://cointelegraph.com/rss', sourceName: 'Cointelegraph' },
        { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', sourceName: 'Coindesk' }
    ],
    'Forex': [
        { url: 'https://www.investing.com/rss/news_1.rss', sourceName: 'Investing.com' },
        { url: 'https://www.fxstreet.com/rss', sourceName: 'FXStreet' }
    ],
    'Finance': [
        { url: 'https://finance.yahoo.com/news/rssindex', sourceName: 'Yahoo Finance' },
        { url: 'https://feeds.content.dowjones.com/public/rss/mw_topstories', sourceName: 'MarketWatch' }
    ],
    'Indexes': [
        { url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html', sourceName: 'CNBC Markets' }
    ],
    'Interest Rate': [
        { url: 'https://www.cnbc.com/id/20910258/device/rss/rss.html', sourceName: 'CNBC Economy' }
    ]
};

// STATIC MOCK DATA as a fail-safe if the public RSS-to-JSON API is rate-limited or down.
const MOCK_NEWS: Record<Category, NewsItem[]> = {
    'Crypto': [
        { title: 'Bitcoin Breaks $75k Resistance as Institutional Inflows Surge', link: '#', pubDate: new Date().toISOString(), content: 'Bitcoin has shattered its previous all-time high, driven by massive ETF inflows and renewed retail interest.', thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=500', source: 'Cointelegraph', category: 'Crypto' },
        { title: 'Ethereum Pushing for new Upgrade: What "The Splurge" Means for Gas Fees', link: '#', pubDate: new Date().toISOString(), content: 'Vitalik Buterin unveils the roadmap for the next major Ethereum upgrade, promising 10x lower fees via L2 scaling.', thumbnail: 'https://images.unsplash.com/photo-1622790698141-94e30457ef12?auto=format&fit=crop&q=80&w=500', source: 'Coindesk', category: 'Crypto' }
    ],
    'Forex': [
        { title: 'USD/JPY Hits 155 as Bank of Japan Maintains Dovish Stance', link: '#', pubDate: new Date().toISOString(), content: 'The Yen continues to slide against the Dollar as the BOJ signals no immediate rate hikes despite rising inflation.', thumbnail: 'https://images.unsplash.com/photo-1580519542024-db531558c4bb?auto=format&fit=crop&q=80&w=500', source: 'FXStreet', category: 'Forex' },
        { title: 'Euro Struggles Near Parity as ECB Signals Pause', link: '#', pubDate: new Date().toISOString(), content: 'European markets remain under pressure as energy concerns weigh on the Eurozone economic outlook.', thumbnail: 'https://images.unsplash.com/photo-1621255823795-582c61ce8882?auto=format&fit=crop&q=80&w=500', source: 'Investing.com', category: 'Forex' }
    ],
    'Finance': [
        { title: 'Wall Street Rallies: S&P 500 Closes Near Record Highs', link: '#', pubDate: new Date().toISOString(), content: 'Tech stocks led the charge today as improving inflation data spurred hopes of a soft landing.', thumbnail: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=500', source: 'Yahoo Finance', category: 'Finance' },
        { title: 'Oil Prices Dip Below $75 on Weak Demand from China', link: '#', pubDate: new Date().toISOString(), content: 'Crude oil futures fell 2% on report showing slowing factory activity in the world\'s second-largest economy.', thumbnail: 'https://images.unsplash.com/photo-1519750292352-c9fc17322ed7?auto=format&fit=crop&q=80&w=500', source: 'MarketWatch', category: 'Finance' }
    ],
    'Indexes': [
        { title: 'Nasdaq 100 Outperforms Dow as AI Hype Continues', link: '#', pubDate: new Date().toISOString(), content: 'Semiconductor stocks drove the Nasdaq higher, while industrial components of the Dow lagged behind.', thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=500', source: 'CNBC Markets', category: 'Indexes' },
        { title: 'VIX Volatility Index Drops to Pre-Pandemic Lows', link: '#', pubDate: new Date().toISOString(), content: 'The fear gauge suggests investors are complacent, though some analysts warn of a potential correction.', thumbnail: 'https://images.unsplash.com/photo-1612178925346-d16834dd8a79?auto=format&fit=crop&q=80&w=500', source: 'CNBC Markets', category: 'Indexes' }
    ],
    'Interest Rate': [
        { title: 'Fed Chair Powell Signals "Higher for Longer" Approach', link: '#', pubDate: new Date().toISOString(), content: 'In his latest remarks, Jerome Powell emphasized that the fight against inflation is not yet won.', thumbnail: 'https://images.unsplash.com/photo-1595185966453-9114ad429bde?auto=format&fit=crop&q=80&w=500', source: 'CNBC Economy', category: 'Interest Rate' },
        { title: 'Mortgage Rates Creep Back Up to 7% on Bond Yield Surge', link: '#', pubDate: new Date().toISOString(), content: 'Homebuyers face renewed pressure as the 10-year Treasury yield climbs back above 4.5%.', thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=500', source: 'CNBC Economy', category: 'Interest Rate' }
    ]
};

export const NewsPage: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<Category>('Crypto');

    const fetchNewsForCategory = async (category: Category) => {
        setLoading(true);
        const feeds = CATEGORY_FEEDS[category];
        let allNews: NewsItem[] = [];

        try {
            // Attempt Fetch
            const feedPromises = feeds.map(async (feed) => {
                try {
                    // Using rss2json to bypass CORS and parse RSS
                    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
                    const data = await response.json();

                    if (data.status === 'ok') {
                        return data.items.map((item: any) => ({
                            title: item.title,
                            link: item.link,
                            pubDate: item.pubDate,
                            content: item.description || item.content,
                            thumbnail: item.thumbnail || item.enclosure?.link || '',
                            source: feed.sourceName,
                            category: category
                        }));
                    }
                    return [];
                } catch (err) {
                    console.warn(`Error fetching ${feed.sourceName}, defaulting to mock.`);
                    return [];
                }
            });

            const results = await Promise.all(feedPromises);
            allNews = results.flat();

            // Sort new to old
            allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

        } catch (error) {
            console.error("Global fetch error:", error);
        } finally {
            // FALLBACK TO MOCK DATA IF FETCH FAILED OR RETURNED NOTHING
            if (allNews.length === 0) {
                console.log(`Using mock data for ${category}`);
                setNews(MOCK_NEWS[category] || []);
            } else {
                setNews(allNews);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsForCategory(activeCategory);
    }, [activeCategory]);

    // Strip HTML for cleaner preview
    const stripHtml = (html: string) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        let text = tmp.textContent || tmp.innerText || "";
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }

    return (
        <div className="pt-8 pb-16 min-h-screen container mx-auto px-4 animate-fade-in">
            <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                Market Insights
            </h1>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-4 mb-8">
                {(Object.keys(CATEGORY_FEEDS) as Category[]).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all border border-white/5 ${activeCategory === cat
                            ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                            : 'bg-black/20 text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item, index) => (
                        <div key={index} className="bg-[#1F0505]/30 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden hover:border-red-500/30 transition-all hover:shadow-xl hover:shadow-red-500/10 group flex flex-col h-full">
                            {item.thumbnail && (
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                    />
                                    <div className="absolute top-0 right-0 bg-black/60 backdrop-blur text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                                        {new Date(item.pubDate).toLocaleDateString()}
                                    </div>
                                </div>
                            )}

                            <div className="p-6 flex flex-col flex-grow relative">
                                <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-red-400 transition-colors leading-tight">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                                </h3>

                                <p className="text-sm text-slate-400 mb-12 line-clamp-3">
                                    {stripHtml(item.content)}
                                </p>

                                {/* Footer: Read More & Source */}
                                <div className="mt-auto absolute bottom-6 left-6 right-6 flex items-center justify-between pt-4 border-t border-white/5">
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-red-400 hover:text-red-300 font-bold text-xs uppercase tracking-wider"
                                    >
                                        Read Article
                                        <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </a>

                                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                        {item.source}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {news.length === 0 && (
                        <div className="col-span-full text-center py-20 text-slate-500">
                            <p>No news found for this category.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
