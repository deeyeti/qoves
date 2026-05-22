import PersonalizedPlan from "@/components/PersonalizedPlan";
import TestDetailHeader from "@/components/TestDetailHeader";
import EndSection from "@/components/EndSection";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main>
      <PersonalizedPlan />
      <div className={styles.spacer} />
      <TestDetailHeader />
      <div className={styles.spacer} />
      <EndSection />
    </main>
  );
}
