import Search from "./search/search";

export default function Home() {
  return (
    <div>
      <Search practices={[]} err={false}></Search>
    </div>
  );
}