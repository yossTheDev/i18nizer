import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const alt = 'i18nizer - Automated i18n for React & Next.js'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1b26',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-20%',
            width: '60%',
            height: '60%',
            background: 'rgba(122, 162, 247, 0.1)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-20%',
            width: '60%',
            height: '60%',
            background: 'rgba(187, 154, 247, 0.1)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              background: '#7aa2f7',
              padding: '15px',
              borderRadius: '12px',
              display: 'flex',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1a1b26"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
          </div>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            i18nizer
          </span>
        </div>

        <p
          style={{
            fontSize: '32px',
            color: '#a9b1d6',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: '1.4',
          }}
        >
          Automated i18n for React & Next.js using AI.
          Extract, translate, and rewrite components in seconds.
        </p>

        <div
          style={{
            marginTop: '60px',
            display: 'flex',
            gap: '20px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '12px 24px',
              borderRadius: '8px',
              color: '#7aa2f7',
              fontSize: '20px',
              fontFamily: 'monospace',
            }}
          >
            npm install -g i18nizer
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
