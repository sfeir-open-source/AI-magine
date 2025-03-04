import { render, screen } from '@testing-library/react';
import { TypographyH1 } from '@/src/components/typography/h1';

describe('TypographyH1', () => {
  it('displays provided children components', () => {
    render(
      <TypographyH1>
        <p>Content here</p>
      </TypographyH1>
    );

    expect(screen.getByText('Content here')).toBeInTheDocument();
  });
});
