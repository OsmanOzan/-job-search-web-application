import { render, screen } from '@testing-library/react';
import Home from './Home';
import { BrowserRouter } from 'react-router-dom';

test('Ana başlık ve arama butonu ekranda', () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  expect(screen.getByText(/Kariyer Fırsatlarını Keşfet/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /İş Bul/i })).toBeInTheDocument();
}); 