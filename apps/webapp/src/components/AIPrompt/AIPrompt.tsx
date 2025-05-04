import React, { useState } from 'react';
import styles from './AIPrompt.module.css';

interface AIPromptProps {
  onSubmitPrompt: (prompt: string) => void;
  isLoading: boolean;
}

export const AIPrompt: React.FC<AIPromptProps> = ({ onSubmitPrompt, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmitPrompt(prompt.trim());
    }
  };
  return (
    <form onSubmit={handleSubmit} className={styles.aiPromptForm}>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
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