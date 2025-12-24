import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import DOMPurify from 'dompurify';

interface MermaidRendererProps {
  chart: string;
  theme: any;
}

// Initialize mermaid with custom theme settings
const initMermaid = (isDarkTheme: boolean) => {
  mermaid.initialize({
    startOnLoad: false,
    theme: isDarkTheme ? 'dark' : 'default',
    securityLevel: 'strict',
    fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis'
    },
    sequence: {
      useMaxWidth: true,
      diagramMarginX: 8,
      diagramMarginY: 8
    },
    gantt: {
      useMaxWidth: true
    }
  });
};

// Sanitize and parse SVG into safe DOM nodes
const createSanitizedSvgElement = (svgString: string): Node | null => {
  // First sanitize with DOMPurify configured for SVG
  const sanitized = DOMPurify.sanitize(svgString, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['foreignObject'],
    ADD_ATTR: ['xmlns', 'xmlns:xlink', 'xlink:href', 'dominant-baseline', 'text-anchor'],
    RETURN_DOM: true
  });

  // Return the first child (the SVG element)
  return sanitized.firstChild;
};

export function MermaidRenderer({ chart, theme }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current || !chart.trim()) return;

      setIsLoading(true);
      setError(null);

      // Determine if theme is dark by checking background color
      const isDarkTheme = theme.colors.bgMain.toLowerCase().includes('#1') ||
                          theme.colors.bgMain.toLowerCase().includes('#2') ||
                          theme.colors.bgMain.toLowerCase().includes('#0');

      // Initialize mermaid with the current theme
      initMermaid(isDarkTheme);

      try {
        // Generate a unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;

        // Render the diagram
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());

        // Create sanitized DOM element from SVG string
        const svgElement = createSanitizedSvgElement(renderedSvg);

        // Clear container and append sanitized SVG
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }

        if (svgElement) {
          containerRef.current.appendChild(svgElement);
        }

        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');

        // Clear container on error
        if (containerRef.current) {
          while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    renderChart();
  }, [chart, theme.colors.bgMain]);

  if (isLoading) {
    return (
      <div
        className="p-4 rounded-lg text-center text-sm"
        style={{
          backgroundColor: theme.colors.bgActivity,
          color: theme.colors.textDim
        }}
      >
        Rendering diagram...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: theme.colors.bgActivity,
          borderColor: theme.colors.error,
          color: theme.colors.error
        }}
      >
        <div className="text-sm font-medium mb-2">Failed to render Mermaid diagram</div>
        <pre className="text-xs whitespace-pre-wrap opacity-75">{error}</pre>
        <details className="mt-3">
          <summary
            className="text-xs cursor-pointer"
            style={{ color: theme.colors.textDim }}
          >
            View source
          </summary>
          <pre
            className="mt-2 p-2 text-xs rounded overflow-x-auto"
            style={{
              backgroundColor: theme.colors.bgMain,
              color: theme.colors.textMain
            }}
          >
            {chart}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-container p-4 rounded-lg overflow-x-auto"
      style={{
        backgroundColor: theme.colors.bgActivity
      }}
    />
  );
}
