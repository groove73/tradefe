export type MarketData = {
    basDt: string;
    idxNm: string;
    clpr: string;
    fltRt: string;
};

export type StockData = {
    basDd: string;
    isuCd: string;
    isuNm: string;
    mktNm: string;
    sectTpNm: string;
    tddClsprc: string;
    cmpprevddPrc: string;
    flucRt: string;
    tddOpnprc: string;
    tddHgprc: string;
    tddLwprc: string;
    accTrdvol: string;
    accTrdval: string;
    mktcap: string;
    listShrs: string;
};

const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchMarketData(date: string = '20241227', type: string = 'KOSPI'): Promise<MarketData[]> {
    try {
        const params = new URLSearchParams({ date, type });
        const url = `${API_BASE_URL}/market-data?${params.toString()}`;
        const response = await fetch(url, {
            cache: 'no-store'
        });
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status} for ${url}`);
            throw new Error(`Failed to fetch market data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching market data from ${API_BASE_URL}/market-data:`, error);
        return [];
    }
}

export async function fetchStockData(date: string, type: string = 'KOSDAQ'): Promise<StockData[]> {
    try {
        const params = new URLSearchParams({ date, type });
        const url = `${API_BASE_URL}/stock-data?${params.toString()}`;
        const response = await fetch(url, {
            cache: 'no-store'
        });
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status} for ${url}`);
            throw new Error(`Failed to fetch stock data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching stock data from ${API_BASE_URL}/stock-data:`, error);
        return [];
    }
}
