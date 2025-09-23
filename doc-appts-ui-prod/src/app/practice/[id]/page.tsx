import { Practice } from "@/app/search/search";
import styles from '@/app/practice/practice.module.css';
import Image from "next/image";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import { getPracticeByNameAndPhone } from "@/app/lib/actions";
import PractitionerCard from "../practitionerCard";
import Link from "next/link";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const res = params.id.split("---");
    res[0] = res[0].replace("%20", " ");
    let practice: Practice = {};
    try {
        practice = await getPracticeByNameAndPhone(res[0], res[1]);
    } catch (exc) {
        console.log(exc);
    };

    return (
        <div>
                <div key={practice.id} className={styles.practiceInfo}>
                <Image src={"/"+practice.thumbnailPath} alt={practice.name+" logo"}
                width={100} height={100}></Image>
                <h2>{practice.name}</h2><br></br>
                <p><b>{practice.address}</b></p>
                <p><b>{practice.phone}</b></p><br></br>
                <p>{practice.description}</p><br></br>
                <GoogleMapsEmbed 
                  apiKey={process.env.MAPS_API_KEY || ''}
                  height={300}
                  width="75%"
                  mode="place"
                  q={practice.address}>
                </GoogleMapsEmbed><br></br><br></br>
                {practice.practitioners ? <div><h3>Practitioners</h3><br></br><br></br>
                <ul>
                {practice.practitioners.map((practitioner) => (
                    <li key={practitioner.id}><Link href={"/practice/"+practice.name+"---"+practice.phone+"/practitioner/"+practitioner.email+"---"+practitioner.mobile}><PractitionerCard practitioner={practitioner}></PractitionerCard></Link></li>
                ))}
                </ul>
                </div> : null}
                </div>
        </div>
    )
}