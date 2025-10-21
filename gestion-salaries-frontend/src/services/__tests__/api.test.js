import api from '../api';

// Mock axios module: expose the same instance used by api.js
jest.mock('axios', () => {
    const instance = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    };
    return {
        create: jest.fn(() => instance),
        __mockInstance: instance,
    };
});

describe('API Service', () => {
    let mockAxios;

    beforeEach(() => {
        // Get the mocked axios instance created by api.js
        // and reset its method calls
        const axios = require('axios');
        mockAxios = axios.__mockInstance;
        jest.clearAllMocks();
    });

    describe('GET requests', () => {
        test('should make GET request to /employes', async () => {
            const mockResponse = { data: [{ id: 1, nom: 'Dupont', prenom: 'Jean' }] };
            mockAxios.get.mockResolvedValue(mockResponse);

            const result = await api.get('/employes');

            expect(mockAxios.get).toHaveBeenCalledWith('/employes');
            expect(result).toEqual(mockResponse);
        });

        test('should make GET request to /attestations', async () => {
            const mockResponse = { data: [{ id: 1, employeId: 1, typeAttestation: 'Travail' }] };
            mockAxios.get.mockResolvedValue(mockResponse);

            const result = await api.get('/attestations');

            expect(mockAxios.get).toHaveBeenCalledWith('/attestations');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('POST requests', () => {
        test('should make POST request to create attestation', async () => {
            const attestationData = {
                employeId: 1,
                typeAttestation: 'Travail'
            };
            const mockResponse = { data: { id: 1, ...attestationData } };
            mockAxios.post.mockResolvedValue(mockResponse);

            const result = await api.post('/attestations', attestationData);

            expect(mockAxios.post).toHaveBeenCalledWith('/attestations', attestationData);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('DELETE requests', () => {
        test('should make DELETE request to delete attestation', async () => {
            const mockResponse = { status: 204 };
            mockAxios.delete.mockResolvedValue(mockResponse);

            const result = await api.delete('/attestations/1');

            expect(mockAxios.delete).toHaveBeenCalledWith('/attestations/1');
            expect(result).toEqual(mockResponse);
        });
    });
}); 