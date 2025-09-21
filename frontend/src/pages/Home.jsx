import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBrands, getModels, getPartTypes, getYears } from '../api'
import FilterPanel from '../components/FilterPanel'
const FUEL_OPTIONS = [
  { value: '',       label: 'All fuels' },
  { value: 'benzin', label: 'gas' },
  { value: 'diesel', label: 'diesel' },
]

export default function Home() {
  const nav = useNavigate()
  const [brands, setBrands] = useState([])
  const [models, setModels] = useState([])
  const [types, setTypes] = useState([])
  const [years, setYears] = useState([])

  const [f, setF] = useState({
    brand_id:'', model_id:'', part_type_id:'',
    year_min:'', year_max:'', fuel:'', q:''
  })

  

  useEffect(() => {
    (async () => {
      const [b,t,y] = await Promise.all([getBrands(), getPartTypes(), getYears()])
      setBrands(Array.isArray(b)?b:[])
      setTypes(Array.isArray(t)?t:[])
      setYears(Array.isArray(y)?y:[])
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (f.brand_id) setModels(await getModels(f.brand_id))
      else setModels([])
      setF(prev => ({...prev, model_id: ''}))
    })()
  }, [f.brand_id])

  function goSearch() {
    const params = new URLSearchParams()
    Object.entries(f).forEach(([k,v]) => { if (v) params.set(k, v) })
    nav(`/parts?${params.toString()}`)
  }

  function goToTypeByLabel(label){
    const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
    const synonyms = { 'ovjes':'suspenzija' };
    const wanted = synonyms[normalize(label)] || normalize(label);
    const t = types.find(x => normalize(x.name) === wanted);
    if (t) nav(`/parts?part_type_id=${t.id}&lock_type=1`);
    else nav('/parts');
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero__inner">
          <h1>Find a part for your car</h1>
          <p>Choose a car and part type - easy and fast.</p>
          <div className="hero__search">
            <input
              placeholder="Search by name (for example. 'discs')"
              value={f.q}
              onChange={(e)=>setF({...f, q:e.target.value})}
              onKeyDown={(e)=>e.key==='Enter' && goSearch()}
            />
            <button onClick={goSearch}>Search</button>
          </div>
        </div>
      </section>

      <section className="selector home-filters">
        <FilterPanel
          value={f}
          onChange={setF}
          onSubmit={(filters) => {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) });
            if (f.q) params.set('q', f.q); 
            nav(`/parts?${params.toString()}`);
          }}
        />
      </section>

      {/* KATEGORIJE */}
      <section className="categories">
        <h2>Popular categories</h2>
        <div className="categories__grid">
          {[
            {label:'Brakes', emoji:'🛑'},
            {label:'Suspension', emoji:'🛞'},
            {label:'Electronics', emoji:'⚡'},
            {label:'Drivetrain', emoji:'🔧'},
            {label:'Ventilation', emoji:'❄️'},
            {label:'Engine', emoji:'🏁'},
          ].map((c,i)=>(
            <div className="cat" key={i} onClick={()=>goToTypeByLabel(c.label)}>
              <div className="cat__icon">{c.emoji}</div>
              <div className="cat__label">{c.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
