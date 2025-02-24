import { describe } from 'vitest';
import { EventPromptForm } from '@/src/components/event-prompt-form/event-prompt-form';
import { render, screen } from '@testing-library/react';

describe('EventPromptForm', () => {
  it('displays title and end date of the event', () => {
    render(
      <EventPromptForm
        event={{
          name: 'DevLille',
          endDate: new Date(2025, 24, 2).toISOString(),
          startDate: new Date().toISOString(),
        }}
      />
    );

    expect(screen.getByText('DevLille')).toBeInTheDocument();
    expect(screen.getByText(/02\/01\/2027 00:00/)).toBeInTheDocument();
  });

  it('prevents submission if form is invalid', async () => {
    // TODO
  });

  it('submits form if filled correctly', async () => {
    // TODO
  });

  it('prevents submission if maximum tries reached', async () => {
    // TODO
  });
});
