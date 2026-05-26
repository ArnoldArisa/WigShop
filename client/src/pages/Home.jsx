import styles from './Home.module.css';

const featured = [
  { id: 1, name: 'Silk Wave Lace Front', price: '$189', img: 'https://placehold.co/400x500/E8E2D9/111111?text=Wig' },
  { id: 2, name: 'Velvet Coil Bob', price: '$149', img: 'https://placehold.co/400x500/E8E2D9/111111?text=Wig' },
  { id: 3, name: 'Golden Hour Straight', price: '$210', img: 'https://placehold.co/400x500/E8E2D9/111111?text=Wig' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.heroEyebrow}>New arrivals</p>
          <h1 className={styles.heroHeading}>Hair that moves<br />with you.</h1>
          <p className={styles.heroSub}>Premium wigs crafted for every style, texture, and occasion.</p>
          <a href="/shop" className={styles.heroBtn}>Shop the collection</a>
        </div>
      </section>

      {/* Featured products */}
      <section className={styles.featured}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Featured styles</h2>
          <div className={styles.grid}>
            {featured.map(p => (
              <a href={`/product/${p.id}`} key={p.id} className={styles.card}>
                <img src={p.img} alt={p.name} className={styles.cardImg} />
                <div className={styles.cardBody}>
                  <span className={styles.cardName}>{p.name}</span>
                  <span className={styles.cardPrice}>{p.price}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Brand blurb */}
      <section className={styles.about}>
        <div className={`container ${styles.aboutInner}`}>
          <h2 className={styles.aboutHeading}>Why Strand &amp; Style?</h2>
          <p className={styles.aboutText}>
            We believe great hair is an act of self-expression. Every piece in our collection
            is selected for quality, comfort, and versatility — so you can wear it your way.
          </p>
          <a href="/shop" className={styles.aboutBtn}>Explore all wigs</a>
        </div>
      </section>
    </div>
  );
}
