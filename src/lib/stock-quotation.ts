export type FscStockPrice = {
    basDt: string;
    srtCd: string;
    isinCd: string;
    itmsNm: string;
    mrktCtg: string;
    clpr: string;
    vs: string;
    fltRt: string;
    mkp: string;
    hipr: string;
    lopr: string;
    trqu: string;
    trPrc: string;
    lstgStCnt: string;
    mrktTotAmt: string;
};

export type FscNewShareCertificate = {
    basDt: string;
    srtCd: string;
    isinCd: string;
    itmsNm: string;
    mrktCtg: string;
    clpr: string;
    vs: string;
    fltRt: string;
    mkp: string;
    hipr: string;
    lopr: string;
    trqu: string;
    trPrc: string;
    lstDt: string;
    delstDt: string;
    stckSrtnCd: string;
    stckItmsNm: string;
    stckClpr: string;
};

export type FscBeneficiaryCertificate = {
    basDt: string;
    srtCd: string;
    isinCd: string;
    itmsNm: string;
    clpr: string;
    vs: string;
    fltRt: string;
    mkp: string;
    hipr: string;
    lopr: string;
    trqu: string;
    trPrc: string;
    lstPnt: string;
    mrktTotAmt: string;
};

export type FscStockSubscriptionRight = {
    basDt: string;
    srtCd: string;
    isinCd: string;
    itmsNm: string;
    mrktCtg: string;
    clpr: string;
    vs: string;
    fltRt: string;
    mkp: string;
    hipr: string;
    lopr: string;
    trqu: string;
    trPrc: string;
    lstDt: string;
    lstPnt: string;
    hngpStrtDt: string;
    hngpEndDt: string;
    stckSrtnCd: string;
    stckItmsNm: string;
    stckClpr: string;
};

export type StockQuotationResponse = {
    items: FscStockPrice[];
    totalCount: number;
    pageNo: number;
    numOfRows: number;
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/stock-quotation`;

export async function fetchStockQuotation(
    basDt: string,
    pageNo: number = 1,
    numOfRows: number = 15,
    itmsNm?: string,
    likeItmsNm?: string
): Promise<StockQuotationResponse> {
    try {
        const params = new URLSearchParams({
            basDt,
            pageNo: pageNo.toString(),
            numOfRows: numOfRows.toString()
        });
        if (itmsNm) params.append('itmsNm', itmsNm);
        if (likeItmsNm) params.append('likeItmsNm', likeItmsNm);
        const url = `${API_BASE_URL}/price?${params.toString()}`;
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to fetch stock quotation: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching stock quotation:', error);
        return { items: [], totalCount: 0, pageNo: 1, numOfRows: 15 };
    }
}

export async function fetchNewShareQuotation(
    basDt: string,
    pageNo: number = 1,
    numOfRows: number = 15,
    itmsNm?: string,
    likeItmsNm?: string
): Promise<{ items: FscNewShareCertificate[], totalCount: number, pageNo: number, numOfRows: number }> {
    try {
        const params = new URLSearchParams({
            basDt,
            pageNo: pageNo.toString(),
            numOfRows: numOfRows.toString()
        });
        if (itmsNm) params.append('itmsNm', itmsNm);
        if (likeItmsNm) params.append('likeItmsNm', likeItmsNm);
        const url = `${API_BASE_URL}/new-share?${params.toString()}`;
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to fetch new share quotation: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching new share quotation:', error);
        return { items: [], totalCount: 0, pageNo: 1, numOfRows: 15 };
    }
}

export async function fetchBeneficiaryQuotation(
    basDt: string,
    pageNo: number = 1,
    numOfRows: number = 15,
    itmsNm?: string,
    likeItmsNm?: string
): Promise<{ items: FscBeneficiaryCertificate[], totalCount: number, pageNo: number, numOfRows: number }> {
    try {
        const params = new URLSearchParams({
            basDt,
            pageNo: pageNo.toString(),
            numOfRows: numOfRows.toString()
        });
        if (itmsNm) params.append('itmsNm', itmsNm);
        if (likeItmsNm) params.append('likeItmsNm', likeItmsNm);
        const url = `${API_BASE_URL}/beneficiary?${params.toString()}`;
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to fetch beneficiary quotation: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching beneficiary quotation:', error);
        return { items: [], totalCount: 0, pageNo: 1, numOfRows: 15 };
    }
}

export async function fetchSubscriptionRightQuotation(
    basDt: string,
    pageNo: number = 1,
    numOfRows: number = 15,
    itmsNm?: string,
    likeItmsNm?: string
): Promise<{ items: FscStockSubscriptionRight[], totalCount: number, pageNo: number, numOfRows: number }> {
    try {
        const params = new URLSearchParams({
            basDt,
            pageNo: pageNo.toString(),
            numOfRows: numOfRows.toString()
        });
        if (itmsNm) params.append('itmsNm', itmsNm);
        if (likeItmsNm) params.append('likeItmsNm', likeItmsNm);
        const url = `${API_BASE_URL}/subscription-right?${params.toString()}`;
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to fetch subscription right quotation: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching subscription right quotation:', error);
        return { items: [], totalCount: 0, pageNo: 1, numOfRows: 15 };
    }
}
