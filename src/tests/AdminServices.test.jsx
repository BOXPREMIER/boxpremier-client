import { getBoxesByType, getWinesByType, getBoxesByWineType, exportOrdersCSV } from '../services/AdminServices';
import API from './Api';

// Мокаем весь модуль API
jest.mock('./Api', () => ({
  get: jest.fn(),
}));

describe('Unit tests: metrics API functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getBoxesByType: возвращает корректный массив', async () => {
    API.get.mockResolvedValue({ data: { data: { basic: 1, premium: 2 } } });

    const result = await getBoxesByType();

    expect(API.get).toHaveBeenCalledWith('/dashboard/metrics/boxes-by-type');
    expect(result).toEqual([
      { _id: 'basic', count: 1 },
      { _id: 'premium', count: 2 },
    ]);
  });

  it('getWinesByType: возвращает корректный массив', async () => {
    API.get.mockResolvedValue({ data: { data: { red: 3, white: 4 } } });

    const result = await getWinesByType();

    expect(API.get).toHaveBeenCalledWith('/dashboard/metrics/wines-by-type');
    expect(result).toEqual([
      { _id: 'red', count: 3 },
      { _id: 'white', count: 4 },
    ]);
  });

  it('getBoxesByWineType: возвращает корректный массив', async () => {
    API.get.mockResolvedValue({ data: { data: { tinto: 5, blanco: 7 } } });

    const result = await getBoxesByWineType();

    expect(API.get).toHaveBeenCalledWith('/dashboard/metrics/boxes-by-wine-type');
    expect(result).toEqual([
      { _id: 'tinto', count: 5 },
      { _id: 'blanco', count: 7 },
    ]);
  });

  it('exportOrdersCSV: возвращает blob', async () => {
    const fakeBlob = new Blob(['csv data'], { type: 'text/csv' });
    API.get.mockResolvedValue({ data: fakeBlob });

    const result = await exportOrdersCSV();

    expect(API.get).toHaveBeenCalledWith('/dashboard/orders/export-csv', {
      responseType: 'blob',
    });
    expect(result).toBe(fakeBlob);
  });
});
