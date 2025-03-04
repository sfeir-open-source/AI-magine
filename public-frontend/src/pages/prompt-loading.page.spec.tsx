import { render } from '@testing-library/react';
import { PromptLoadingPage } from '@/src/pages/prompt-loading.page';
import { useImageGenerationListener } from '@/src/hooks/useImageGenerationListener';

vi.mock('@/src/hooks/useImageGenerationListener');

describe('PromptLoadingPage', () => {
  it('waits for image generation events', () => {
    render(<PromptLoadingPage />);

    expect(useImageGenerationListener).toHaveBeenCalled();
  });
});
