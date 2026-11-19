export const useAuthSession = () => {
  const { $authClient } = useNuxtApp();
  return $authClient.useSession(useAuthFetch);
};
