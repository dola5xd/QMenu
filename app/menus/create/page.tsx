async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id, design } = await searchParams;
  return <div></div>;
}

export default Page;
