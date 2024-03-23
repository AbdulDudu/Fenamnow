import Link from "next/link";

const articePortableText = {
  block: {
    normal: ({ children }: any) => (
      <p className="my-8 text-base md:text-lg">{children}</p>
    ),
    h1: ({ children }: any) => (
      <h1 className="my-8 text-3xl font-semibold leading-tight md:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="my-8 text-2xl font-semibold leading-tight md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-1xl my-8 font-semibold leading-tight md:text-2xl">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="md:text-1xl my-8 text-lg font-semibold leading-tight">
        {children}
      </h4>
    ),
    h5: ({ children }: any) => (
      <h5 className="my-8 text-base font-semibold leading-tight md:text-lg">
        {children}
      </h5>
    ),
    h6: ({ children }: any) => (
      <h6 className="my-8 text-sm font-semibold leading-tight md:text-base">
        {children}
      </h6>
    )
  },

  list: {
    bullet: ({ children }: any) => (
      <ul className="my-4 list-disc pl-7">{children}</ul>
    ),
    number: ({ children }: any) => <ol className="my-4 pl-7">{children}</ol>
  },
  listItem: {
    bullet: ({ children }: any) => <li className="my-2 pl-1">{children}</li>,
    number: ({ children }: any) => (
      <li className="my-1.5 list-decimal pl-1">{children}</li>
    )
  },
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value?.href?.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      const targ = !value?.href?.startsWith("/") ? "_blank" : undefined;
      return !value?.href?.startsWith("/") ? (
        <a
          href={value.href}
          rel={rel}
          target={targ}
          className="text-appPurple-100 dark:text-appRed-100 text-decoration-underline"
          aria-label={`${children}`}
        >
          {children}
        </a>
      ) : (
        <Link
          href={value.href}
          className="text-appPurple-100 dark:text-appRed-100 text-decoration-underline"
        >
          {children}
        </Link>
      );
    },
    strong: ({ children }: any) => (
      <strong className="font-semibold">{children}</strong>
    ),
    emphasis: ({ children }: any) => (
      <em className="font-italic">{children}</em>
    ),
    code: ({ children }: any) => (
      <span className="dark:text-appPurple-100 text-appRed-100 rounded-md bg-gray-300 bg-opacity-15 px-1 py-2 font-mono text-sm font-bold leading-normal">
        {children}
      </span>
    )
  }
};

export default articePortableText;
