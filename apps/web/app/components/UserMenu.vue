<script setup lang="ts">
const { $authClient } = useNuxtApp();
const session = $authClient.useSession();
const toast = useToast();

const handleSignOut = async () => {
  try {
    await $authClient.signOut({
      fetchOptions: {
        onError: (error) => {
          toast.add({
            description: error?.error?.message || "Unknown error",
            title: "Sign out failed",
          });
        },
        onSuccess: async () => {
          toast.add({ title: "Signed out successfully" });
          await navigateTo("/", { external: true, replace: true });
        },
      },
    });
  } catch (error) {
    toast.add({
      description: error instanceof Error ? error.message : "Please try again.",
      title: "An unexpected error occurred during sign out",
    });
  }
};
</script>

<template>
  <div>
    <USkeleton v-if="session.isPending" class="h-9 w-24" />

    <UButton v-else-if="!session.data" variant="outline" to="/login">
      Sign In
    </UButton>

    <UButton
      v-else
      variant="solid"
      icon="i-lucide-log-out"
      label="Sign out"
      @click="handleSignOut()"
    />
  </div>
</template>
