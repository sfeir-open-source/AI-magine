import { AppLayout } from '@/src/components/app-layout/app-layout';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

describe('AppLayout', () => {
  it('displays a title and provided children components', () => {
    render(
      <MemoryRouter>
        <AppLayout>
          <p>Content here</p>
        </AppLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('SF≡IR GENΛI')).toBeInTheDocument();
    expect(screen.getByText('Content here')).toBeInTheDocument();
  });
});
