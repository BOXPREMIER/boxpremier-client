import { describe, it, expect, vi, beforeEach } from 'vitest';
import API from '../services/Api';
import { 
    getBoxesByType, 
    getWinesByType, 
    getBoxesByWineType, 
    exportOrdersCSV 
} from '../services/AdminServices';

vi.mock('../services/Api');

describe('Dashboard API Functions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getBoxesByType', () => {
        it('should fetch and transform boxes by type data', async () => {
            const mockResponse = {
                data: {
                    data: {
                        basic: 5,
                        premium: 3,
                        deluxe: 2
                    }
                }
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await getBoxesByType();

            expect(API.get).toHaveBeenCalledWith('/dashboard/metrics/boxes-by-type');
            expect(API.get).toHaveBeenCalledTimes(1);
            expect(result).toEqual([
                { _id: 'basic', count: 5 },
                { _id: 'premium', count: 3 },
                { _id: 'deluxe', count: 2 }
            ]);
        });

        it('should handle empty data', async () => {
            const mockResponse = {
                data: {
                    data: {}
                }
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await getBoxesByType();

            expect(result).toEqual([]);
            expect(Array.isArray(result)).toBe(true);
        });

        it('should handle API errors', async () => {
            const errorMessage = 'Network Error';
            API.get.mockRejectedValue(new Error(errorMessage));

            await expect(getBoxesByType()).rejects.toThrow(errorMessage);
            expect(API.get).toHaveBeenCalledWith('/dashboard/metrics/boxes-by-type');
        });

        it('should handle single item response', async () => {
            const mockResponse = {
                data: {
                    data: {
                        basic: 1
                    }
                }
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await getBoxesByType();

            expect(result).toEqual([
                { _id: 'basic', count: 1 }
            ]);
            expect(result.length).toBe(1);
        });
    });

    describe('getWinesByType', () => {
        it('should fetch and transform wines by type data', async () => {
            const mockResponse = {
                data: {
                    data: {
                        red: 10,
                        white: 8,
                        rose: 5
                    }
                }
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await getWinesByType();

            expect(API.get).toHaveBeenCalledWith('/dashboard/metrics/wines-by-type');
            expect(API.get).toHaveBeenCalledTimes(1);
            expect(result).toEqual([
                { _id: 'red', count: 10 },
                { _id: 'white', count: 8 },
                { _id: 'rose', count: 5 }
            ]);
        });

        it('should handle empty wines data', async () => {
            const mockResponse = {
                data: {
                    data: {}
                }
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await getWinesByType();

            expect(result).toEqual([]);
        });

        it('should handle wines API errors', async () => {
            API.get.mockRejectedValue(new Error('API Error'));

            await expect(getWinesByType()).rejects.toThrow('API Error');
        });

        it('should handle zero count values', async () => {
            const mockResponse = {
                data: {
                    data: {
                        red: 0,
                        white: 5
                    }
                }
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await getWinesByType();

            expect(result).toEqual([
                { _id: 'red', count: 0 },
                { _id: 'white', count: 5 }
            ]);
        });
    });

    describe('getBoxesByWineType', () => {
        it('should fetch and transform boxes by wine type data', async () => {
            const mockResponse = {
                data: {
                    data: {
                        cabernet: 7,
                        merlot: 4,
                        chardonnay: 6
                    }
                }
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await getBoxesByWineType();

            expect(API.get).toHaveBeenCalledWith('/dashboard/metrics/boxes-by-wine-type');
            expect(API.get).toHaveBeenCalledTimes(1);
            expect(result).toEqual([
                { _id: 'cabernet', count: 7 },
                { _id: 'merlot', count: 4 },
                { _id: 'chardonnay', count: 6 }
            ]);
        });

        it('should handle empty boxes by wine type data', async () => {
            const mockResponse = {
                data: {
                    data: {}
                }
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await getBoxesByWineType();

            expect(result).toEqual([]);
        });

        it('should handle boxes by wine type API errors', async () => {
            API.get.mockRejectedValue(new Error('Server Error'));

            await expect(getBoxesByWineType()).rejects.toThrow('Server Error');
        });

        it('should handle large count values', async () => {
            const mockResponse = {
                data: {
                    data: {
                        cabernet: 1000,
                        merlot: 9999
                    }
                }
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await getBoxesByWineType();

            expect(result).toEqual([
                { _id: 'cabernet', count: 1000 },
                { _id: 'merlot', count: 9999 }
            ]);
        });
    });

    describe('exportOrdersCSV', () => {
        it('should fetch CSV blob data with correct config', async () => {
            const mockBlob = new Blob(['order_id,customer,total\n1,John,100'], { 
                type: 'text/csv' 
            });
            const mockResponse = {
                data: mockBlob
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await exportOrdersCSV();

            expect(API.get).toHaveBeenCalledWith('/dashboard/orders/export-csv', {
                responseType: 'blob'
            });
            expect(API.get).toHaveBeenCalledTimes(1);
            expect(result).toBe(mockBlob);
            expect(result instanceof Blob).toBe(true);
        });

        it('should handle CSV export errors', async () => {
            API.get.mockRejectedValue(new Error('Export failed'));

            await expect(exportOrdersCSV()).rejects.toThrow('Export failed');
            expect(API.get).toHaveBeenCalledWith('/dashboard/orders/export-csv', {
                responseType: 'blob'
            });
        });

        it('should handle empty CSV blob', async () => {
            const mockBlob = new Blob([], { type: 'text/csv' });
            const mockResponse = {
                data: mockBlob
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await exportOrdersCSV();

            expect(result).toBe(mockBlob);
            expect(result.size).toBe(0);
        });

        it('should handle timeout errors', async () => {
            API.get.mockRejectedValue(new Error('Request timeout'));

            await expect(exportOrdersCSV()).rejects.toThrow('Request timeout');
        });
    });

    describe('Data transformation consistency', () => {
        it('should transform data consistently across all metric functions', async () => {
            const mockData = {
                type1: 100,
                type2: 200,
                type3: 300
            };

            const mockResponse = {
                data: {
                    data: mockData
                }
            };

            const expectedResult = [
                { _id: 'type1', count: 100 },
                { _id: 'type2', count: 200 },
                { _id: 'type3', count: 300 }
            ];

            API.get.mockResolvedValue(mockResponse);
            const boxesResult = await getBoxesByType();
            expect(boxesResult).toEqual(expectedResult);

            API.get.mockResolvedValue(mockResponse);
            const winesResult = await getWinesByType();
            expect(winesResult).toEqual(expectedResult);

            API.get.mockResolvedValue(mockResponse);
            const boxesByWineResult = await getBoxesByWineType();
            expect(boxesByWineResult).toEqual(expectedResult);
        });

        it('should return array with correct structure', async () => {
            const mockResponse = {
                data: {
                    data: {
                        test: 42
                    }
                }
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await getBoxesByType();

            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toHaveProperty('_id');
            expect(result[0]).toHaveProperty('count');
            expect(typeof result[0]._id).toBe('string');
            expect(typeof result[0].count).toBe('number');
        });

        it('should preserve key order from Object.entries', async () => {
            const mockResponse = {
                data: {
                    data: {
                        alpha: 1,
                        beta: 2,
                        gamma: 3
                    }
                }
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await getBoxesByType();

            expect(result[0]._id).toBe('alpha');
            expect(result[1]._id).toBe('beta');
            expect(result[2]._id).toBe('gamma');
        });
    });

    describe('Edge cases', () => {
        it('should handle null data gracefully', async () => {
            const mockResponse = {
                data: {
                    data: null
                }
            };

            API.get.mockResolvedValue(mockResponse);

            await expect(getBoxesByType()).rejects.toThrow();
        });

        it('should handle undefined response', async () => {
            API.get.mockResolvedValue(undefined);

            await expect(getBoxesByType()).rejects.toThrow();
        });

        it('should handle string values in counts', async () => {
            const mockResponse = {
                data: {
                    data: {
                        basic: '5',
                        premium: '3'
                    }
                }
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await getBoxesByType();

            expect(result).toEqual([
                { _id: 'basic', count: '5' },
                { _id: 'premium', count: '3' }
            ]);
        });

        it('should handle special characters in keys', async () => {
            const mockResponse = {
                data: {
                    data: {
                        'type-1': 10,
                        'type_2': 20,
                        'type.3': 30
                    }
                }
            };

            API.get.mockResolvedValue(mockResponse);

            const result = await getBoxesByType();

            expect(result).toEqual([
                { _id: 'type-1', count: 10 },
                { _id: 'type_2', count: 20 },
                { _id: 'type.3', count: 30 }
            ]);
        });
    });
});