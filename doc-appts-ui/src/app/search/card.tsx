import { Practice } from "./search";
import styles from '@/app/search/home.module.css';
import Image from "next/image";

interface cardProps {
    practice: Practice,
    distance: string
}

export default function Card(practice: cardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.cardThumbnail}>
            <Image src={"/"+practice.practice.thumbnailPath} alt="Thumbnail" height={50} width={50}></Image>
            </div>
            <div className={styles.cardDetails}>
            {practice.practice.name}<br></br>
            {practice.practice.address}
            {practice.distance !== "None" ? <><br></br>{practice.distance} away</> : null}
            </div>
        </div>
    )
}