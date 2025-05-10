import React from 'react';
import { useProjectStore } from '../../state/projectStore';

export const AISuggestionsPanel: React.FC = () => {
  const {
    suggestions,
    isLoadingSuggestions,
    suggestionsError,
    fetchSuggestions,
  } = useProjectStore();

  return (
    <div style={{
      background: '#1b2435',
      padding: '1rem',
      borderRadius: '8px',
      margin: '1rem 0',
      minHeight: '100px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <strong>AI Suggestions</strong>
        <button
          onClick={() => {
            try {
              // eslint-disable-next-line no-console
              console.log('[AISuggestionsPanel] Fetch Suggestions button clicked');
              fetchSuggestions();
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error('[AISuggestionsPanel] Error in fetchSuggestions', err);
            }
          }}
          disabled={isLoadingSuggestions}
        >
          {isLoadingSuggestions ? 'Loading...' : 'Get Suggestions'}
        </button>
      </div>
      {suggestionsError && (
        <div style={{ color: '#f99', margin: '0.7em 0' }}>
          {/* eslint-disable-next-line no-console */}
          {console.log('[AISuggestionsPanel] suggestionsError:', suggestionsError)}
          {suggestionsError}
        </div>
      )}
      {suggestions.length === 0 && !isLoadingSuggestions && (
        <div style={{ color: '#888', marginTop: 12 }}>
          {/* eslint-disable-next-line no-console */}
          {console.log('[AISuggestionsPanel] No suggestions.')}
          No suggestions yet.
        </div>
      )}
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {suggestions.map((s, i) => {
          // eslint-disable-next-line no-console
          console.log('[AISuggestionsPanel] suggestion', s);
          return (
            <li key={i} style={{
              background: '#223050',
              borderRadius: '5px',
              margin: '6px 0',
              padding: '0.7em 0.9em',
              color: '#cae1ff'
            }}>
              <span style={{
                fontWeight: 600,
                color: '#adebff',
                borderBottom: '1px dashed #466bf7',
                marginRight: '0.8em'
              }}>
                [{s.type}]
              </span>
              {s.suggestion}
              <div style={{ fontSize: '0.88em', color: '#8e9dc7', marginTop: 4 }}>
                {s.reasoning}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};