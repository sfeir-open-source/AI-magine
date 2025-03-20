import { Lightbox } from '@/src/components/lightbox/lightbox';
import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import i18n from '@/src/config/i18n';

describe('Lightbox', () => {
  it('displays provided image', () => {
    render(
      <Lightbox
        image={{
          id: '1',
          prompt: 'test prompt',
          author: 'test author',
          url: 'https://foo.com',
        }}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByAltText('test prompt')).toBeInTheDocument();
    expect(screen.getByText(new RegExp('test author'))).toBeInTheDocument();
  });

  it('calls onClose when closing lightbox', async () => {
    const onCloseMock = vi.fn();

    render(
      <Lightbox
        image={{
          id: '1',
          prompt: 'test prompt',
          author: 'test author',
          url: 'https://foo.com',
        }}
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    await userEvent.click(screen.getAllByText(i18n.t('close'))[0]);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
