import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useNavigate } from 'react-router-dom';
import Home from '../pages/Home';

// Mock de framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, className, ...props }) => (
      <div style={style} className={className} {...props}>{children}</div>
    ),
    p: ({ children, style, className, ...props }) => (
      <p style={style} className={className} {...props}>{children}</p>
    ),
  },
  useScroll: () => ({
    scrollYProgress: 0
  }),
  useTransform: () => 0,
}));

// Mock del componente Button
vi.mock('../components/Button.jsx', () => ({
  default: ({ title, action }) => (
    <button onClick={action}>{title}</button>
  )
}));

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Home Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    vi.clearAllMocks();
  });

  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  it('renderiza el título principal correctamente', () => {
    renderHome();
    expect(screen.getByText('El arte del vino en cada botella')).toBeInTheDocument();
  });

  it('renderiza el subtítulo del hero', () => {
    renderHome();
    expect(screen.getByText('Experiencias que despiertan los sentidos')).toBeInTheDocument();
  });

  it('renderiza el título "BOX PREMIER"', () => {
    renderHome();
    // El texto está dividido en spans, así que buscamos con una función
    expect(screen.getByText((content, element) => {
      return element.tagName === 'H1' && content.includes('PREMIER');
    })).toBeInTheDocument();
  });

  it('renderiza el texto introductorio', () => {
    renderHome();
    expect(screen.getByText('Te brinda:')).toBeInTheDocument();
  });

  it('renderiza todos los beneficios', () => {
    renderHome();
    expect(screen.getByText('Envío gratuito')).toBeInTheDocument();
    expect(screen.getByText('Facilidad de pago y suscripción')).toBeInTheDocument();
    expect(screen.getByText('Productos de calidad')).toBeInTheDocument();
    expect(screen.getByText('Opciones de regalo')).toBeInTheDocument();
  });

  it('renderiza las imágenes de beneficios con alt text correcto', () => {
    renderHome();
    expect(screen.getByAltText('Envío gratuito')).toBeInTheDocument();
    expect(screen.getByAltText('Facilidad de pago')).toBeInTheDocument();
    expect(screen.getByAltText('Productos de calidad')).toBeInTheDocument();
    expect(screen.getByAltText('Opciones de regalo')).toBeInTheDocument();
  });

  it('renderiza el botón "Conoce más"', () => {
    renderHome();
    const button = screen.getByText('Conoce más');
    expect(button).toBeInTheDocument();
  });

  it('navega a la página de suscripción al hacer clic en el botón', () => {
    renderHome();
    const button = screen.getByText('Conoce más');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/app/subscription');
  });

  it('renderiza el texto del parallax', () => {
    renderHome();
    expect(screen.getByText('Desde los viñedos, directo a tu copa')).toBeInTheDocument();
    expect(screen.getByText('Tradición, pasión y sabor en cada sorbo')).toBeInTheDocument();
  });

  it('renderiza el título de la sección de reseñas', () => {
    renderHome();
    expect(screen.getByText('Algunos comentarios de nuestros clientes Vino Premier')).toBeInTheDocument();
  });

  it('renderiza todas las reseñas de clientes', () => {
    renderHome();
    // Buscar sin comillas o con regex más flexible
    expect(screen.getByText(/Muy buena selección de vinos y envío rápido/i)).toBeInTheDocument();
    expect(screen.getByText(/Excelente servicio al cliente y vino de calidad/i)).toBeInTheDocument();
    expect(screen.getByText(/La suscripción vale la pena, gran descubrimiento mensual/i)).toBeInTheDocument();
  });

  it('renderiza los autores de las reseñas', () => {
    renderHome();
    expect(screen.getByText('– María G.')).toBeInTheDocument();
    expect(screen.getByText('– Juan P.')).toBeInTheDocument();
    expect(screen.getByText('– Laura M.')).toBeInTheDocument();
  });
});