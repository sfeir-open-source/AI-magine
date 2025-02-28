import { AppLayout } from '@/src/components/app-layout/app-layout';
import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';

describe('AppLayout', () => {
  it('displays a title and provided children components', () => {
    render(
      <AppLayout>
        <p>Content here</p>
      </AppLayout>
    );

    expect(screen.getByText('SF≡IR GENΛI')).toBeInTheDocument();
    expect(screen.getByText('Content here')).toBeInTheDocument();
  });
});
