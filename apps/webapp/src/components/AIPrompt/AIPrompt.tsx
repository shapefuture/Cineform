import React, { useState } from 'react';
import styles from './AIPrompt.module.css';

interface AIPromptProps {
  onSubmitPrompt: (prompt: string) => void;
  isLoading: boolean;
}

export const AIPrompt: React.FC<AIPromptProps> = ({ onSubmitPrompt, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      // eslint-disable-next-line no-console
      console.log('[AIPrompt] handleSubmit', { prompt, isLoading });
      if (prompt.trim() && !isLoading) {
        try {
          onSubmitPrompt(prompt.trim());
          // eslint-disable-next-line no-console
          console.log('[AIPrompt] onSubmitPrompt called', prompt.trim());
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[AIPrompt] Error in onSubmitPrompt', err);
          alert('Failed to submit prompt: ' + (err as Error)?.message);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[AIPrompt] Error in handleSubmit', err);
    }
  };
  return (
    <form onSubmit={handleSubmit} className={styles.aiPromptForm}>
      <input
        type="text"
        value={prompt}
        onChange={(e) => {
          // eslint-disable-next-line no-console
          console.log('[AIPrompt] input change', e.target.value);
          setPrompt(e.target.value);
        }}
        placeholder="Describe the animation..."
        disabled={isLoading}
        className={styles.promptInput}
      />
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className={styles.submitButton}
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
    </form>
  );
};