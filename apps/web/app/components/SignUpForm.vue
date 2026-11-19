<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const { $authClient } = useNuxtApp();

const emit = defineEmits<{
  switchToSignIn: [];
}>();

const toast = useToast();
const loading = ref(false);

const fields: AuthFormField[] = [
  {
    id: "sign-up-name",
    label: "Name",
    name: "name",
    placeholder: "Enter your name",
    required: true,
    type: "text",
  },
  {
    id: "sign-up-email",
    label: "Email",
    name: "email",
    placeholder: "Enter your email",
    required: true,
    type: "email",
  },
  {
    id: "sign-up-password",
    label: "Password",
    name: "password",
    placeholder: "Enter your password",
    required: true,
    type: "password",
  },
];

const schema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true;
  try {
    await $authClient.signUp.email(
      {
        email: event.data.email,
        name: event.data.name,
        password: event.data.password,
      },
      {
        onError: (error) => {
          toast.add({
            description: error.error.message,
            title: "Sign up failed",
          });
        },
        onSuccess: () => {
          toast.add({ title: "Sign up successful" });
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
        title="Create Account"
        icon="i-lucide-user-plus"
        :submit="{ label: 'Sign Up', loading }"
        @submit="onSubmit"
      >
        <template #description>
          Already have an account?
          <ULink
            class="text-primary font-medium"
            @click="$emit('switchToSignIn')"
          >
            Sign In
          </ULink>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
