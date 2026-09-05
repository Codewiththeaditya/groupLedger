export default function GroupHeader({ group }) {
  return (
    <section className="border-b pb-5">
      <h1 className="text-3xl font-bold">
        {group.name}
      </h1>

      <p className="mt-2 capitalize text-zinc-500">
        {group.type}
      </p>
    </section>
  );
}