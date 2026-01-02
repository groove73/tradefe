export type CommodityTradingInfo = {
    basDd: string;
    isuCd?: string;
    isuNm?: string;
    accTrdvol: string;
    accTrdval: string;
    // Gold & Emissions
    tddClsprc?: string;
    cmpprevddPrc?: string;
    flucRt?: string;
    tddOpnprc?: string;
    tddHgprc?: string;
    tddLwprc?: string;
    // Oil
    oilNm?: string;
    wtAvgPrc?: string;
    wtDisAvgPrc?: string;
};

const API_BASE_URL = 'http://localhost:8080/api/commodities';

export async function fetchCommodityTradingInfo(marketType: string, basDd: string): Promise<CommodityTradingInfo[]> {
    try {
        const url = `${API_BASE_URL}/trading-info/${marketType}?basDd=${basDd}`;
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to fetch commodity data: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching commodity data:', error);
        return [];
    }
}
