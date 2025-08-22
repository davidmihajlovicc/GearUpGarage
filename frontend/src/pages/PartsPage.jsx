import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import FilterPanel from '../components/FilterPanel'
import PartCard from '../components/PartCard'
import { searchParts } from '../api'

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => Object.fromEntries(new URLSearchParams(search)), [search]);
}

export default function PartsPage() {
  const q = useQuery();

  const [filters, setFilters] = useState({
    brand_id:'', model_id:'', part_type_id:'', part_subtype_id:'',
    year_min:'', year_max:'', fuel:'', q:''
  });
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  async function fetchData(f = filters) {
    setLoading(true)
    const data = await searchParts(f)
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  // initial: preload from URL
  useEffect(() => {
    const init = { ...filters, ...q };
    setFilters(init);
    fetchData(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    q.brand_id, q.model_id, q.part_type_id, q.part_subtype_id,
    q.year_min, q.year_max, q.fuel, q.q
  ]);

  const lockedTypeId = q.lock_type ? q.part_type_id : '';

  return (
    <div className="page">
      <section className="selector selector--parts">
        <FilterPanel
          value={filters}
          onChange={setFilters}
          onSubmit={fetchData}
          lockedPartTypeId={lockedTypeId}
        />
      </section>

      <div className="searchbar">
        <input
          className="searchbar__input"
          placeholder="Search by title (for example -> 'brakes', 'fuel pump')"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          onKeyDown={(e)=> e.key==='Enter' && fetchData()}
        />
        <button className="searchbar__btn" onClick={() => fetchData()}>
          Search
        </button>
      </div>

      {loading ? (
        <div className="muted">Loading...</div>
      ) : items.length === 0 ? (
        <div className="muted">No results for given filters.</div>
      ) : (
        <div className="grid-cards">
          {items.map(p => <PartCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  )
}
