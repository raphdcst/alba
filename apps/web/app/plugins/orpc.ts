import type { AppRouterClient } from "@alba/api/routers/index";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  const requestURL = useRequestURL();
  const config = useRuntimeConfig();
  const serverUrl =
    (import.meta.server && config.serverUrl) || config.public.serverUrl;
  const resolvedServerUrl = serverUrl.replace(/\/$/u, "");
  const rpcUrl = new URL(`${resolvedServerUrl}/rpc`, requestURL.origin).href;

  const rpcLink = new RPCLink({
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
    headers: import.meta.server ? useRequestHeaders(["cookie"]) : {},
    url: rpcUrl,
  });

  const client: AppRouterClient = createORPCClient(rpcLink);
  const orpcUtils = createTanstackQueryUtils(client);

  return {
    provide: {
      orpc: orpcUtils,
    },
  };
});
