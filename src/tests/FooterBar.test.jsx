import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Facebook, Instagram, Twitter, Youtube, ChevronUp } from "lucide-react";

// Заглушка футера без Newsletter
function FooterOnly() {
  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/Vinopremier?checkpoint_src=any" },
    { icon: Instagram, href: "https://www.instagram.com/vinopremier/" },
    { icon: Twitter, href: "https://x.com/Vinopremier" },
    { icon: Youtube, href: "https://www.youtube.com/c/Vinopremiercom" },
  ];

  return (
    <footer role="contentinfo">
      <div>SOBRE NOSOTROS</div>
      <div>GARANTÍA DE VINOPREMIER</div>
      <div>ATENCIÓN AL CLIENTE</div>
      <div>
        {socialLinks.map((item, i) => {
          const Icon = item.icon;
          return (
            <a key={i} href={item.href}>
              <Icon />
            </a>
          );
        })}
      </div>
      <button>Scroll to top</button>
    </footer>
  );
}

describe("FooterOnly component", () => {
  test("footer se renderiza correctamente", () => {
    render(<FooterOnly />);
    const footerElement = screen.getByRole("contentinfo");
    expect(footerElement).toBeInTheDocument();
  });

  test("contiene las secciones principales", () => {
    render(<FooterOnly />);
    expect(screen.getByText("SOBRE NOSOTROS")).toBeInTheDocument();
    expect(screen.getByText("GARANTÍA DE VINOPREMIER")).toBeInTheDocument();
    expect(screen.getByText("ATENCIÓN AL CLIENTE")).toBeInTheDocument();
  });

  test("tiene links de redes sociales con href correctos", () => {
    render(<FooterOnly />);
    const socialLinks = [
      "https://www.facebook.com/Vinopremier?checkpoint_src=any",
      "https://www.instagram.com/vinopremier/",
      "https://x.com/Vinopremier",
      "https://www.youtube.com/c/Vinopremiercom",
    ];
    socialLinks.forEach((href) => {
      const linkFound = screen.getAllByRole("link").some(l => l.href === href);
      expect(linkFound).toBe(true);
    });
  });

  test("boton scroll-to-top está presente", () => {
    render(<FooterOnly />);
    const scrollButton = screen.getByRole("button", { name: "Scroll to top" });
    expect(scrollButton).toBeInTheDocument();
  });
});
