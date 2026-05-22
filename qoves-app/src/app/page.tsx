import PersonalizedPlan from "@/components/PersonalizedPlan";
import TestDetailHeader from "@/components/TestDetailHeader";
import EndSection from "@/components/EndSection";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main>
      <div className={styles.desktopOnlyHero}>
        <PersonalizedPlan />
        <div className={styles.spacer} />
      </div>
      
      <TestDetailHeader />
      <div className={styles.spacer} />
      <EndSection />
    </main>
  );
}
