import { ProgressButton } from '@/src/components/progress-button/progress-button';
import { render, screen } from '@testing-library/react';

describe('ProgressButton', () => {
  it('renders children', () => {
    render(<ProgressButton progress={0}>child</ProgressButton>);

    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('renders background with width associated to progress value', () => {
    render(<ProgressButton progress={50}>child</ProgressButton>);

    expect(screen.getByTestId('progress-background').style.width).toEqual(
      '50%'
    );
  });
});
