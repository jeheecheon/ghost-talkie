import LayoutContainer from "@workspace/ui/primitives/layout-container";
import { html } from "../../../../docs/privacy-policy.md";

export default function PrivacyPolicyRoute() {
  return (
    <LayoutContainer className="py-24">
      <article
        className="prose prose-sm prose-neutral dark:prose-invert md:prose-base mx-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </LayoutContainer>
  );
}
