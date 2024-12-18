import Link from "next/link";

export default function Home() {
  const links = [
    {
      title: "Actions",
      path: "/actions",
    },
    {
      title: "Use Transition",
      path: "/use-transition",
    },
    {
      title: "Use Optimistic",
      path: "/use-optimistic",
    },
  ];

  return (
    <div className="text-center w-full h-100vh pt-10">
      {links.map((data, ind) => (
        <Link href={data.path} key={ind}>
          <h1 className="text-xl hover:text-gray-300">{data.title}</h1>
        </Link>
      ))}
    </div>
  );
}
