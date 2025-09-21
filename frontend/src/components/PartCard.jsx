import { Link } from 'react-router-dom';
import { API_ORIGIN } from '../lib/constants';

function resolveImg(image) {
  if (!image) return '';
  if (image.startsWith('http') || image.startsWith('//')) return image;   
  return image.startsWith('/uploads')
    ? image
    : `/${String(image).replace(/^\//, '')}`;
}

export default function PartCard({ p }) {
  const title = p.title || p.name || 'Bez naziva';
  const priceStr = p.price != null && !isNaN(Number(p.price))
    ? `${Number(p.price).toFixed(2)} €` : '—';
  const years = p.year_from ? `${p.year_from}${p.year_to ? `–${p.year_to}` : ''}` : '—';
  const img = resolveImg(p.image);
  const fuel = p.fuel ? (p.fuel === 'diesel' ? 'Diesel' : 'Gas') : null;

  return (
    <Link to={`/parts/${p.id}`} className="card part-card">
      <div className="part-card__media">
        {img ? (
          <img src={img} alt={title} className="part-card__img" />
        ) : (
          <div className="part-card__img part-card__img--placeholder">Without picture</div>
        )}
      </div>

      <div className="part-card__body">
        <div className="part-card__title" title={title}>{title}</div>
        <div className="part-card__meta">
          {[p.brand, p.model, p.part_type, p.part_subtype].filter(Boolean).join(' • ') || '—'}
        </div>

        <div className="part-card__rows">
          <div className="row">
            <span className="muted"></span>
            <span>{years}</span>
          </div>
          {fuel && (
            <div className="row">
              <span className="muted"></span>
              <span>{fuel}</span>
            </div>
          )}
          <div className="row">
            <span className="muted"></span>
            <strong>{priceStr}</strong>
          </div>
        </div>
      </div>
    </Link>
  );
}
