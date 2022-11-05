import type { Stack, App } from '@serverless-stack/resources';

export interface StackFnProps {
  stack: Stack;
  app: App;
}
