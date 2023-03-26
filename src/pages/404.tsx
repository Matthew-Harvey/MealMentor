import Link from "next/link";

const Page404 = () => {

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-[#313131] to-[#000000]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                <span className="text-[#DB6310]">Page </span>not found.
            </h1>
            <Link className="text-2xl text-white" href={"/"}>
                Back to home
            </Link>
        </div>
      </main>
    </>
  );
};

export default Page404;
