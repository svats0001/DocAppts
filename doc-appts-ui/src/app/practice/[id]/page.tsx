import { Practice } from "@/app/search/search";
import styles from '@/app/practice/practice.module.css';
import Image from "next/image";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import { getPracticeByPublicId } from "@/app/lib/actions";
import PractitionerCard from "../practitionerCard";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>}) {
    /*const params = await props.params;
    const res = params.id.split("---");
    res[0] = res[0].replace("%20", " ");*/
    const publicId = (await searchParams).practice;

    /*let practice: Practice = {};*/
    let practice: Practice = {};

    try {
        practice = await getPracticeByPublicId(publicId!);
        console.log(practice);
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
                {practice.practitioners ? <div><h3>Practitioners</h3><br></br>
                <ul>
                {practice.practitioners.map((practitioner) => (
                    <li key={practitioner.id}><Link href={"/practice/"+practice.name+"/practitioner/"+practitioner.firstName+" "+practitioner.lastName+"?practice="+practice.publicId+"&practitioner="+practitioner.publicId}><PractitionerCard practitioner={practitioner}></PractitionerCard></Link></li>
                ))}
                </ul>
                </div> : null}
                </div>
        </div>
    )
}