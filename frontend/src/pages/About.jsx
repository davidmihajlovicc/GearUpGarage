export default function About() {
  const lastUpdated = "21.08.2025"; 
  
  return (
    <div className="page about">
      <h1>About GearUp Garage</h1>
      <p>
        GearUp Garage is a web application for quickly finding and purchasing car parts.
        Our focus is on simple filters, clear results, and secure shopping.
      </p>

      <div className="about__cards">
        <section className="about__card">
          <h2>What we offer</h2>
          <ul>
            <li>Search by brand, model, type, and year</li>
            <li>Filter by fuel (Gas/Diesel)</li>
            <li>Detailed part pages with photo and price</li>
            <li>Cart and fast checkout</li>
          </ul>
        </section>

        <section className="about__card">
          <h2>Technologies</h2>
          <ul>
            <li>Frontend: React + React Router</li>
            <li>Backend: Node.js (Express) + MySQL</li>
            <li>Authentication: JWT</li>
          </ul>
        </section>

        <section className="about__card">
          <h2>Contact</h2>
          <p>
            Have a suggestion or issue? Get in touch:
          </p>
          <ul>
            <li>Email: <a href="mailto:support@gearupgarage.example">support@gearupgarage.example</a></li>
            <li>Phone: +385 91 000 0000</li>
          </ul>
        </section>
      </div>

      <div className="about__meta">
        <p><strong>Version:</strong> 1.0.0</p>
        <p><strong>Last updated:</strong> {lastUpdated}</p>
      </div>
    </div>
  );
}
