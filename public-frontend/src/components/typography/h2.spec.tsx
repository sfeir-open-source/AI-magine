import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import { TypographyH2 } from '@/src/components/typography/h2';

describe('TypographyH2', () => {
  it('displays provided children components', () => {
    render(
      <TypographyH2>
        <p>Content here</p>
      </TypographyH2>
    );

    expect(screen.getByText('Content here')).toBeInTheDocument();
  });
});
