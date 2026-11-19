<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const { $authClient } = useNuxtApp();

const emit = defineEmits<{
  switchToSignUp: [];
}>();

const toast = useToast();
const loading = ref(false);

const fields: AuthFormField[] = [
  {
    id: "sign-in-email",
    label: "Email",
    name: "email",
    placeholder: "Enter your email",
    required: true,
    type: "email",
  },
  {
    id: "sign-in-password",
    label: "Password",
    name: "password",
    placeholder: "Enter your password",
    required: true,
    type: "password",
  },
];

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true;
  try {
    await $authClient.signIn.email(
      {
        email: event.data.email,
        password: event.data.password,
      },
      {
        onError: (error) => {
          toast.add({
            description: error.error.message,
            title: "Sign in failed",
          });
        },
        onSuccess: () => {
          toast.add({ title: "Sign in successful" });
          navigateTo("/dashboard", { replace: true });
        },
      }
    );
  } catch (error) {
    toast.add({
      description: error instanceof Error ? error.message : "Please try again.",
      title: "An unexpected error occurred",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        title="Welcome Back"
        icon="i-lucide-log-in"
        :submit="{ label: 'Sign In', loading }"
        @submit="onSubmit"
      >
        <template #description>
          Need an account?
          <ULink
            class="text-primary font-medium"
            @click="$emit('switchToSignUp')"
          >
            Sign Up
          </ULink>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
