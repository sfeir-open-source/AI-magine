import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import { TypographyLead } from './lead';

describe('TypographyLead', () => {
  it('displays provided children components', () => {
    render(<TypographyLead><span>Content here</span></TypographyLead>)

    expect(screen.getByText('Content here')).toBeInTheDocument();
  })
})