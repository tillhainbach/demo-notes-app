import { Template, Match } from 'aws-cdk-lib/assertions';
import { App, getStack } from '@serverless-stack/resources';
import { StorageStack } from '../StorageStack';
import { describe, it } from 'vitest';

describe('StorageStack', () => {
  it('is billed per request', () => {
    const app = new App();

    app.stack(StorageStack);

    const template = Template.fromStack(getStack(StorageStack));
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      BillingMode: 'PAY_PER_REQUEST',
    });
    template.hasResourceProperties('AWS::S3::Bucket', {
      CorsConfiguration: Match.anyValue(),
    });
  });
});
