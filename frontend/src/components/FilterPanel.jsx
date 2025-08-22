import { useEffect, useState } from 'react';
import { getBrands, getModels, getPartTypes, getYears, getPartSubtypes } from '../api';

const EMPTY = {
  brand_id:'', model_id:'', part_type_id:'', part_subtype_id:'',
  year_min:'', year_max:'', fuel:''
};

const FUEL_OPTIONS = [
  { value: '',       label: 'All fuels' },
  { value: 'gas', label: 'gas' },
  { value: 'diesel', label: 'diesel' },
];

export default function FilterPanel({ value={}, onChange, onSubmit, lockedPartTypeId = '' }) {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [years, setYears] = useState([]);
  const [filters, setFilters] = useState({ ...EMPTY, ...value });

  useEffect(() => {
    (async () => {
      const [b, t, y] = await Promise.all([getBrands(), getPartTypes(), getYears()]);
      setBrands(Array.isArray(b) ? b : []);
      setTypes(Array.isArray(t) ? t : []);
      setYears(Array.isArray(y) ? y : []);
    })();
  }, []);

  useEffect(() => {
    const next = { ...EMPTY, ...value };
    if (lockedPartTypeId) next.part_type_id = lockedPartTypeId;
    setFilters(next);
  }, [value, lockedPartTypeId]);

  useEffect(() => {
    (async () => {
      if (filters.brand_id) {
        const ms = await getModels(filters.brand_id);
        setModels(Array.isArray(ms) ? ms : []);
      } else setModels([]);
    })();
  }, [filters.brand_id]);

  useEffect(() => {
    (async () => {
      if (filters.part_type_id) {
        const st = await getPartSubtypes(filters.part_type_id);
        setSubtypes(Array.isArray(st) ? st : []);
      } else setSubtypes([]);
    })();
  }, [filters.part_type_id]);

  function update(name, val) {
    if (lockedPartTypeId && name === 'part_type_id') return;
    const next = { ...filters, [name]: val };
    if (name === 'brand_id') next.model_id = '';
    if (name === 'part_type_id') next.part_subtype_id = '';
    setFilters(next);
    onChange?.(next);
  }

  function resetAll() {
    const next = { ...EMPTY };
    if (lockedPartTypeId) next.part_type_id = lockedPartTypeId;
    setFilters(next);
    onChange?.(next);
    onSubmit?.(next);
  }

  const lockedTypeName =
    lockedPartTypeId && (types.find(t => String(t.id) === String(lockedPartTypeId))?.name || null);

  return (
    <div className="filterbar">
      <div className="filterbar__grid">
        {/* Marka */}
        <div className="field">
          <label>Brand</label>
          <div className="select-wrap">
            <select className="select"
              value={filters.brand_id}
              onChange={(e)=>update('brand_id', e.target.value)}
            >
              <option value="">All brands</option>
              {(Array.isArray(brands)?brands:[]).map(b=>(
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Model */}
        <div className="field">
          <label>Model</label>
          <div className="select-wrap">
            <select className="select"
              value={filters.model_id}
              onChange={(e)=>update('model_id', e.target.value)}
              disabled={!filters.brand_id}
            >
              <option value="">{filters.brand_id ? 'All models' : 'Firstly choose a brand'}</option>
              {(Array.isArray(models)?models:[]).map(m=>(
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tip dijela */}
        {!lockedPartTypeId && (
          <div className="field">
            <label>Part type</label>
            <div className="select-wrap">
              <select className="select"
                value={filters.part_type_id}
                onChange={(e)=>update('part_type_id', e.target.value)}
              >
                <option value="">All types</option>
                {(Array.isArray(types)?types:[]).map(t=>(
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {lockedPartTypeId && lockedTypeName && (
          <div className="field">
            <label>Part type</label>
            <div className="pill" title="Odabrano s početne stranice">{lockedTypeName}</div>
          </div>
        )}

        {/* Pod-tip (Dio) */}
        <div className="field">
          <label>Part subtype</label>
          <div className="select-wrap">
            <select className="select"
              value={filters.part_subtype_id || ''}
              onChange={(e)=>update('part_subtype_id', e.target.value)}
              disabled={!filters.part_type_id}
            >
              <option value="">{filters.part_type_id ? 'All parts' : 'Firstly choose a type'}</option>
              {(Array.isArray(subtypes)?subtypes:[]).map(s=>(
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        
        <div className="field">
          <label>Fuel</label>
          <div className="select-wrap">
            <select className="select"
              value={filters.fuel}
              onChange={(e)=>update('fuel', e.target.value)}
            >
              {FUEL_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Godina od */}
        <div className="field">
          <label>Year from</label>
          <div className="select-wrap">
            <select className="select"
              value={filters.year_min}
              onChange={(e)=>update('year_min', e.target.value)}
            >
              <option value="">—</option>
              {(Array.isArray(years)?years:[]).map(y=>(
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Godina do */}
        <div className="field">
          <label>Year until</label>
          <div className="select-wrap">
            <select className="select"
              value={filters.year_max}
              onChange={(e)=>update('year_max', e.target.value)}
            >
              <option value="">—</option>
              {(Array.isArray(years)?years:[]).map(y=>(
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Gumbi */}
        <div className="field field--button">
          <div className="btn-row">
            <button className="btn btn--primary" onClick={() => onSubmit?.(filters)}>
              Search parts
            </button>
            <button className="btn btn--ghost" onClick={resetAll}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
