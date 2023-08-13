import Image from "next/image";
import { Inter } from "next/font/google";
import ConversationTerminal from "@/components/ConversationTerminal";
import styles from "@/styles/Home.module.css";
import { generateImage } from "@/lib/api";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={styles.terminalWrapper}>
      <ConversationTerminal is_server={false} />
      <ConversationTerminal is_server={true} />
      <button
        onClick={async () => {
          const image = await generateImage("Natalie Portman reading a book");
          console.log(image);
        }}
      >
        Generate
      </button>
    </div>
  );
}
