import styles from "./page.module.css";

const nearbyPets = [
  {
    name: "Milo",
    species: "Dog",
    age: "2 years",
    vibe: "Loves park walks",
    tag: "Friendly",
  },
  {
    name: "Poppy",
    species: "Cat",
    age: "1 year",
    vibe: "Enjoys lazy evenings",
    tag: "Calm",
  },
  {
    name: "Bunny",
    species: "Rabbit",
    age: "8 months",
    vibe: "Loves garden playtime",
    tag: "Playful",
  },
];

const features = [
  {
    title: "Regional language first",
    text: "Users can search and interact in Hindi, Hinglish, and English.",
  },
  {
    title: "Safe local meetups",
    text: "Suggested pet-friendly cafes, parks, and verified community spots.",
  },
  {
    title: "Simple matching flow",
    text: "Swipe, match, and contact without needing a complicated onboarding journey.",
  },
];

const steps = [
  "Create a pet profile",
  "Browse nearby pets",
  "Match and connect",
  "Plan the meetup",
];

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>PetVibe MVP</span>
          <h1>Find your pet&apos;s next best friend.</h1>
          <p>
            A social discovery platform for Indian pet parents who want more than
            just a feed — they want real connections, local meetups, and trust.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#discover">
              Start matching
            </a>
            <a className={styles.secondaryButton} href="#flow">
              See the flow
            </a>
          </div>
          <div className={styles.stats}>
            <div>
              <strong>43M+</strong>
              <span>pet dogs in India</span>
            </div>
            <div>
              <strong>1B+</strong>
              <span>market opportunity</span>
            </div>
          </div>
        </div>

        <div className={styles.previewCard}>
          <div className={styles.previewTop}>
            <span>Nearby now</span>
            <span>3 matches</span>
          </div>
          <div className={styles.previewImage}>
            <span>🐶</span>
          </div>
          <div className={styles.previewInfo}>
            <h2>Milo</h2>
            <p>Golden retriever • 2 years</p>
            <div>
              <span>Playful</span>
              <span>Park-friendly</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="features">
        <div className={styles.sectionHeader}>
          <span>Why it works</span>
          <h2>Built for real pet-parent habits</h2>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article className={styles.featureCard} key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="flow">
        <div className={styles.sectionHeader}>
          <span>MVP journey</span>
          <h2>From profile to playdate</h2>
        </div>
        <div className={styles.stepsRow}>
          {steps.map((step, index) => (
            <div className={styles.stepCard} key={step}>
              <span>{index + 1}</span>
              <h3>{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} id="discover">
        <div className={styles.sectionHeader}>
          <span>Discovery</span>
          <h2>Sample nearby pets</h2>
        </div>
        <div className={styles.petGrid}>
          {nearbyPets.map((pet) => (
            <article className={styles.petCard} key={pet.name}>
              <div className={styles.petAvatar}>{pet.species === "Dog" ? "🐕" : pet.species === "Cat" ? "🐈" : "🐇"}</div>
              <div>
                <div className={styles.petRow}>
                  <h3>{pet.name}</h3>
                  <span>{pet.tag}</span>
                </div>
                <p>
                  {pet.species} • {pet.age}
                </p>
                <small>{pet.vibe}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
