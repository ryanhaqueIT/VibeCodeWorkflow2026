import { render, screen } from '@testing-library/react';
import { OrchestratorShell } from '../../web/OrchestratorShell';

describe('OrchestratorShell', () => {
  it('renders the shell header and key panels', () => {
    render(<OrchestratorShell />);

    expect(screen.getByText('Maestro Orchestrator')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /run beads in parallel/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Beads' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sessions' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Inspector' })).toBeInTheDocument();
  });

  it('shows sample session output', () => {
    render(<OrchestratorShell />);

    expect(screen.getByText(/1: \[runner\] session_started/i)).toBeInTheDocument();
    expect(screen.getByText(/\[codex\] analyzing context-pack/i)).toBeInTheDocument();
  });
});
