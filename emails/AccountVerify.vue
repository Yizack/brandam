<script setup lang="ts">
import { SITE } from "../shared/utils/site";
import { spacing, styles } from "./theme";

defineProps<{
  lang: string;
  link: string;
}>();
</script>

<template>
  <EHtml :lang="lang">
    <EHead>
      <title>Email verification</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="x-apple-disable-message-reformatting">
      <EFont font-family="Arial" />
    </EHead>
    <EBody :style="{ margin: 0 }">
      <ESection :style="styles.container">
        <ESection :style="styles.card">
          <EHeading as="h1" :style="styles.logo">{{ SITE.name }}</EHeading>
          <EHeading as="h2" :style="styles.heading">Email verification</EHeading>
          <EHr :style="styles.hr" />
          <EHeading as="h3" :style="styles.subheading">Hello,</EHeading>
          <EText :style="styles.message">You are almost ready to complete your registration! Simply click the button below to verify your email address and get started.</EText>
          <ESection :style="{ textAlign: 'center', margin: `${spacing.md} 0` }">
            <EButton :href="link" :style="styles.button">
              <strong>Verify my email address</strong>
            </EButton>
          </ESection>
          <EHr :style="styles.hr" />
          <!-- Footer -->
          <ESection :style="styles.footer">
            <EText :style="{ ...styles.footerText, marginBottom: spacing.xs }">
              © {{ new Date().getFullYear() }} {{ SITE.name }}
            </EText>
            <EText :style="styles.footerText">
              This verification email was sent to you as part of the sign up process for a {{ SITE.name }} account. If you did not initiate this request, please ignore this email.
            </EText>
          </ESection>
        </ESection>
      </ESection>
    </EBody>
  </EHtml>
</template>
