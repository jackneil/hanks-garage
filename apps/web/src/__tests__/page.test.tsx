import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    // Use getByRole to target the h1 specifically since "Hank's Hits" appears in footer too
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hank's Hits");
  });

  it('renders the tagline', () => {
    render(<Home />);
    expect(
      screen.getByText('Monster trucks, games, and awesome stuff!')
    ).toBeInTheDocument();
  });

  it('renders the Play Monster Truck button', () => {
    render(<Home />);
    expect(screen.getByText('Play Monster Truck')).toBeInTheDocument();
  });

  it('renders the How to Play section', () => {
    render(<Home />);
    expect(screen.getByText('How to Play')).toBeInTheDocument();
  });

  it('renders mobile and desktop control instructions', () => {
    render(<Home />);
    expect(screen.getByText('On Phone')).toBeInTheDocument();
    expect(screen.getByText('On Computer')).toBeInTheDocument();
  });

  it('has correct link to monster truck game', () => {
    render(<Home />);
    const playButton = screen.getByText('Play Monster Truck').closest('a');
    expect(playButton).toHaveAttribute('href', '/games/monster-truck');
  });

});
