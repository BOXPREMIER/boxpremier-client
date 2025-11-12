import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import MainPage from '../pages/MainPage';

// Mock для useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock для framer-motion (opcional, para tests más rápidos)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('MainPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderMainPage = () => {
    return render(
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
    );
  };

  test('renderiza correctamente todos los textos principales', () => {
    renderMainPage();
    
    expect(screen.getByText('¿No sabes qué vino elegir?')).toBeInTheDocument();
    expect(screen.getByText('Elige')).toBeInTheDocument();
    expect(screen.getByText('¡Haz clic y déjanos sorprenderte!')).toBeInTheDocument();
  });

  test('renderiza el logo de Box Premier', () => {
    renderMainPage();
    
    const logo = screen.getByAltText('Box Premier Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/bpr.PNG');
  });

  test('renderiza todas las imágenes de botellas', () => {
    renderMainPage();
    
    // 9 botellas únicas × 2 (duplicadas) × 3 columnas = 54 imágenes totales
    const bottleImages = screen.getAllByAltText(/Botella b\d\.PNG/);
    expect(bottleImages.length).toBe(18); // 9 botellas × 2 duplicaciones
  });

  test('navega a /Home cuando se hace clic en la página', () => {
    renderMainPage();
    
    const mainContainer = screen.getByText('¿No sabes qué vino elegir?').closest('div').parentElement;
    fireEvent.click(mainContainer);
    
    expect(mockNavigate).toHaveBeenCalledWith('/Home');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test('tiene las clases CSS correctas para el contenedor principal', () => {
    renderMainPage();
    
    const mainDiv = screen.getByText('¿No sabes qué vino elegir?').closest('div').parentElement;
    expect(mainDiv).toHaveClass('relative', 'min-h-screen', 'w-full', 'bg-white', 'overflow-hidden');
  });

  test('las botellas tienen opacity-60 para el fondo', () => {
    const { container } = renderMainPage();
    
    const carouselContainer = container.querySelector('.opacity-60');
    expect(carouselContainer).toBeInTheDocument();
  });

  test('verifica que existen 3 columnas de botellas', () => {
    const { container } = renderMainPage();
    
    const columns = container.querySelectorAll('.flex.flex-col.gap-4');
    expect(columns.length).toBe(3);
  });

  test('cada imagen de botella tiene las clases responsive correctas', () => {
    renderMainPage();
    
    const bottleImages = screen.getAllByAltText(/Botella b\d\.PNG/);
    bottleImages.forEach(img => {
      expect(img).toHaveClass('w-32', 'sm:w-40', 'md:w-48', 'lg:w-56', 'object-contain', 'drop-shadow-xl');
    });
  });

  test('el contenido principal tiene z-index correcto', () => {
    const { container } = renderMainPage();
    
    const mainContent = container.querySelector('.z-20');
    expect(mainContent).toBeInTheDocument();
  });

  test('snapshot test - verifica que la estructura no cambie inesperadamente', () => {
    const { container } = renderMainPage();
    expect(container).toMatchSnapshot();
  });
});

// Tests de integración adicionales
describe('MainPage - Integration Tests', () => {
  test('todas las imágenes tienen rutas correctas', () => {
    render(
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
    );
    
    const expectedBottles = [
      'b1.PNG', 'b2.PNG', 'b3.PNG',
      'b4.PNG', 'b5.PNG', 'b6.PNG',
      'b7.PNG', 'b8.PNG', 'b9.PNG'
    ];
    
    expectedBottles.forEach(bottle => {
      const images = screen.getAllByAltText(`Botella ${bottle}`);
      expect(images.length).toBeGreaterThan(0);
      images.forEach(img => {
        expect(img).toHaveAttribute('src', `/${bottle}`);
      });
    });
  });

  test('el layout es responsive en diferentes tamaños', () => {
    const { container } = render(
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
    );
    
    // Verifica que existan clases responsive
    const responsiveElements = container.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });
});