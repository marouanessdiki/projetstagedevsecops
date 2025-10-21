import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import AttestationPage from '../AttestationPage';
import api from '../../services/api';

// Mock API calls
jest.mock('../../services/api', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

describe('AttestationPage', () => {
    // Mock API data
    const mockEmployes = [{ id: 1, nom: 'Dupont', prenom: 'Jean' }];
    const mockAttestations = [{ id: 1, employeId: 1, typeAttestation: 'Travail' }];

    beforeEach(() => {
        // Reset mocks before each test
        api.get.mockReset();

        // Mock API responses
        api.get.mockImplementation((url) => {
            if (url === '/employes') return Promise.resolve({ data: mockEmployes });
            if (url === '/attestations') return Promise.resolve({ data: mockAttestations });
            return Promise.reject(new Error('Unknown URL'));
        });
    });

    test('renders AttestationPage component', async () => {
        await act(async () => {
            render(<AttestationPage />);
        });

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('Générer une attestation')).toBeInTheDocument();
            expect(screen.getByText('Dupont Jean')).toBeInTheDocument();
        });
    });

    // Add other tests here
});