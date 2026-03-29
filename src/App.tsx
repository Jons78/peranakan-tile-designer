import React from 'react';
import html2canvas from 'html2canvas';

import s1_0 from './assets/tile assets/s1_0.png';
import s1_1 from './assets/tile assets/s1_1.png';
import s1_2 from './assets/tile assets/s1_2.png';
import s1_3 from './assets/tile assets/s1_3.png';
import s1_4 from './assets/tile assets/s1_4.png';
import s1_5 from './assets/tile assets/s1_5.png';
import s1_6 from './assets/tile assets/s1_6.png';

import s2_0 from './assets/tile assets/s2_0.png';
import s2_1 from './assets/tile assets/s2_1.png';
import s2_2 from './assets/tile assets/s2_2.png';
import s2_3 from './assets/tile assets/s2_3.png';
import s2_4 from './assets/tile assets/s2_4.png';

import s3_0 from './assets/tile assets/s3_0.png';
import s3_1 from './assets/tile assets/s3_1.png';
import s3_2 from './assets/tile assets/s3_2.png';
import s3_3 from './assets/tile assets/s3_3.png';
import s3_4 from './assets/tile assets/s3_4.png';
import s3_5 from './assets/tile assets/s3_5.png';
import s3_6 from './assets/tile assets/s3_6.png';

import s4_0 from './assets/tile assets/s4_0.png';
import s4_1 from './assets/tile assets/s4_1.png';
import s4_2 from './assets/tile assets/s4_2.png';
import s4_3 from './assets/tile assets/s4_3.png';
import s4_4 from './assets/tile assets/s4_4.png';
import s4_5 from './assets/tile assets/s4_5.png';
import s4_6 from './assets/tile assets/s4_6.png';
import s4_7 from './assets/tile assets/s4_7.png';
import s4_8 from './assets/tile assets/s4_8.png';

const section1Options = [s1_0, s1_1, s1_2, s1_3, s1_4, s1_5, s1_6];
const section2Options = [s2_0, s2_1, s2_2, s2_3, s2_4];
const section3Options = [s3_0, s3_1, s3_2, s3_3, s3_4, s3_5, s3_6];
const section4Options = [s4_0, s4_1, s4_2, s4_3, s4_4, s4_5, s4_6, s4_7, s4_8];

function LayerImage({
  src,
  size,
}: {
  src: string;
  size: number;
}) {
  return (
    <img
      src={src}
      alt=""
      style={{
        position: 'absolute',
        inset: 0,
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'cover',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  );
}

export default function App() {
  const [section1, setSection1] = React.useState(0);
  const [section2, setSection2] = React.useState(0);
  const [section3, setSection3] = React.useState(0);
  const [section4, setSection4] = React.useState(0);

  const [isDownloading, setIsDownloading] = React.useState(false);

  const tileRef = React.useRef<HTMLDivElement>(null);

  const nextSection1 = () =>
    setSection1((prev) => (prev + 1) % section1Options.length);

  const nextSection2 = () =>
    setSection2((prev) => (prev + 1) % section2Options.length);

  const nextSection3 = () =>
    setSection3((prev) => (prev + 1) % section3Options.length);

  const nextSection4 = () =>
    setSection4((prev) => (prev + 1) % section4Options.length);

  const resetTile = () => {
    setSection1(0);
    setSection2(0);
    setSection3(0);
    setSection4(0);
  };

  const submitTile = async () => {
    if (!tileRef.current) return;

    const tileData = {
      section1,
      section2,
      section3,
      section4,
    };

    try {
      const canvas = await html2canvas(tileRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const imageData = canvas.toDataURL('image/png');

      const response = await fetch(
        'https://ecologically-stenosed-hana.ngrok-free.dev/submit-tile',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tileData, imageData }),
        }
      );

      if (!response.ok) throw new Error('Failed to submit tile');

      alert('Tile submitted successfully!');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Submit failed.');
    }
  };

  const downloadTile = async () => {
    if (!tileRef.current) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(tileRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `tile-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error(error);
      alert('Download failed.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Peranakan Tile Designer</h1>
        <p style={subtitleStyle}>Create your own heritage tile design</p>

        <div ref={tileRef} style={tileWrapperStyle}>
          <LayerImage src={section1Options[section1]} size={320} />
          <LayerImage src={section2Options[section2]} size={320} />
          <LayerImage src={section3Options[section3]} size={320} />
          <LayerImage src={section4Options[section4]} size={320} />
        </div>

        <div style={buttonGroupStyle}>
          <button onClick={nextSection1} style={buttonStyle}>
            Next Section 1
          </button>
          <button onClick={nextSection2} style={buttonStyle}>
            Next Section 2
          </button>
          <button onClick={nextSection3} style={buttonStyle}>
            Next Section 3
          </button>
          <button onClick={nextSection4} style={buttonStyle}>
            Next Section 4
          </button>
        </div>

        <div style={buttonGroupStyle}>
          <button onClick={downloadTile} style={buttonStyle}>
            {isDownloading ? 'Downloading...' : 'Download Tile'}
          </button>
          <button onClick={submitTile} style={buttonStyle}>
            Submit Tile
          </button>
          <button onClick={resetTile} style={secondaryButtonStyle}>
            Reset Tile
          </button>
        </div>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(to bottom, #FFF8F0, #FFE5D9)',
  padding: '24px',
  fontFamily: 'Arial, sans-serif',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '420px',
  margin: '0 auto',
};

const titleStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 700,
  color: '#2D1B1B',
  marginBottom: '8px',
};

const subtitleStyle: React.CSSProperties = {
  color: '#6B5B5B',
  marginBottom: '24px',
};

const tileWrapperStyle: React.CSSProperties = {
  position: 'relative',
  width: '320px',
  height: '320px',
  margin: '0 auto 24px auto',
  background: '#F5F0E8',
  border: '3px solid #D4AF37',
  borderRadius: '12px',
  overflow: 'hidden',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'grid',
  gap: '12px',
  marginBottom: '16px',
};

const buttonStyle: React.CSSProperties = {
  padding: '14px 16px',
  borderRadius: '10px',
  border: 'none',
  background: '#2D7A5F',
  color: 'white',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: '14px 16px',
  borderRadius: '10px',
  border: '2px solid #2D7A5F',
  background: 'white',
  color: '#2D7A5F',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
};