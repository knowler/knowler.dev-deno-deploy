/** @jsx h */
import { h } from "preact";
import render from "preact-render-to-string";
import { serve, Status, STATUS_TEXT } from "std/http";
import { LoaderDataContext, LocationContext, MatchesContext } from "~/hooks.js";

const routes = [
  {
    module: () => import("~/root.jsx"),
    pattern: new URLPattern({ pathname: "*" }),
  },
  {
    module: () => import("~/routes/index.jsx"),
    pattern: new URLPattern({ pathname: "/" }),
  },
  {
    module: () => import("~/routes/contact.jsx"),
    pattern: new URLPattern({ pathname: "/contact{/}?" }),
  },
  {
    pattern: new URLPattern({ pathname: "/blog/*" }),
  },
  {
    pattern: new URLPattern({ pathname: "/blog{/}?" }),
  },
  {
    pattern: new URLPattern({ pathname: "/blog/:slug{/}?" }),
  },
  {
    module: () => import("~/routes/:slug.jsx"),
    pattern: new URLPattern({ pathname: "/:slug" }),
  },
];

serve(async (request) => {
  const { pathname } = new URL(request.url);

  try {
    const matches = [];
    const templates = [];

    for (const route of routes) {
      const match = route.pattern.exec({ pathname });
      if (match) {
        const { default: template, loader } = await route.module();

        const params = match?.pathname.groups;
        templates.push(template);
        matches.push({
          data: loader ? await loader({ request, params }) : undefined,
          pathname: route.pattern.pathname,
          params,
        });
      }
    }

    if (matches.length === 0) return notFound();

    console.log(matches?.map((match) => match.pathname));

    let index = 0;
    const composeTemplate = () => {
      if (index === templates.length) return;

      const Template = templates[index];
      const loaderData = matches[index].data;

      const Child = composeTemplate(++index);

      return () => (
        <LoaderDataContext.Provider value={loaderData}>
          <Template>
            <Child />
          </Template>
        </LoaderDataContext.Provider>
      );
    };
    const Route = composeTemplate();

    return jsx(
      <LocationContext.Provider value={new URL(request.url)}>
        <MatchesContext.Provider value={matches}>
          <Route />
        </MatchesContext.Provider>
      </LocationContext.Provider>,
    );
  } catch (error) {
    console.error(error);
    return jsx(<h1>Server error</h1>, { status: 500 });
  }
});

function notFound() {
  return jsx(
    <h1>Not found</h1>,
    { status: 404 },
  );
}

function jsx(jsx, init) {
  const headers = init?.headers instanceof Headers
    ? init.headers
    : new Headers(init?.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "text/html; charset=utf-8");
  }

  return new Response(`<!doctype html>${render(jsx, {}, { pretty: true })}`, {
    status: init?.status ?? Status.OK,
    statusText: init?.statusText ?? STATUS_TEXT[init?.status ?? Status.OK],
    headers,
  });
}
