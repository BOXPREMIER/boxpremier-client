import API from './Api';

export const getBoxesByType = async () => {
    const { data } = await API.get('/dashboard/metrics/boxes-by-type');
    const obj = data.data; // { basic: 1, premium: 1 }
    const array = Object.entries(obj).map(([key, value]) => ({
        _id: key,
        count: value
    }));
    // Resultado: [{ _id: 'basic', count: 1 }, { _id: 'premium', count: 1 }]
    return array;
};

export const getWinesByType = async () => {
    const { data } = await API.get('/dashboard/metrics/wines-by-type');
    const obj = data.data; // { basic: 1, premium: 1 }
    const array = Object.entries(obj).map(([key, value]) => ({
        _id: key,
        count: value
    }));
    // Resultado: [{ _id: 'basic', count: 1 }, { _id: 'premium', count: 1 }]
    return array;
};

export const getBoxesByWineType = async () => {
    const { data } = await API.get('/dashboard/metrics/boxes-by-wine-type');
    const obj = data.data; // { basic: 1, premium: 1 }
    const array = Object.entries(obj).map(([key, value]) => ({
        _id: key,
        count: value
    }));
    // Resultado: [{ _id: 'basic', count: 1 }, { _id: 'premium', count: 1 }]
    return array;
};

export const exportOrdersCSV = async () => {
    const { data } = await API.get('/dashboard/orders/export-csv', {
        responseType: 'blob'
    });
    return data;
};