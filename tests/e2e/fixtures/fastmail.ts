import type { BrowserContext, Request, Route } from '@playwright/test';
import type { MaskedEmail } from 'fastmail-masked-email';
import type { E2EMaskedEmail } from '../data/types';

export type FastmailOperation =
  'session' | 'get' | 'create' | 'update' | 'destroy';

interface RecordedCall {
  operation: FastmailOperation;
  body?: Record<string, unknown>;
  token: string | null;
}

interface Failure {
  status: number;
  body: string;
}

interface SetFailure {
  type: string;
  description: string;
}

const accountId = 'e2e-account';
const coreCapability = 'urn:ietf:params:jmap:core';
const maskedEmailCapability = 'https://www.fastmail.com/dev/maskedemail';

export class FastmailMock {
  private emails = new Map<string, E2EMaskedEmail>();
  private failures = new Map<FastmailOperation, Failure[]>();
  private delays = new Map<FastmailOperation, Promise<void>[]>();
  private setFailures = new Map<FastmailOperation, SetFailure[]>();
  private recordedCalls: RecordedCall[] = [];
  private createCounter = 0;

  constructor(private context: BrowserContext) {}

  async install() {
    await this.context.route('https://api.fastmail.com/**', (route) =>
      this.handleRoute(route)
    );
  }

  seedEmails(emails: E2EMaskedEmail[]) {
    this.emails = new Map(
      emails.map((email) => [email.id, structuredClone(email)])
    );
  }

  failNext(operation: FastmailOperation, status = 500, body = 'E2E failure') {
    const failures = this.failures.get(operation) ?? [];
    failures.push({ status, body });
    this.failures.set(operation, failures);
  }

  delayNext(operation: FastmailOperation) {
    let release!: () => void;
    const delay = new Promise<void>((resolve) => {
      release = resolve;
    });
    const delays = this.delays.get(operation) ?? [];
    delays.push(delay);
    this.delays.set(operation, delays);
    return release;
  }

  failNextSet(
    operation: Exclude<FastmailOperation, 'session' | 'get'>,
    description = 'E2E operation failure'
  ) {
    const failures = this.setFailures.get(operation) ?? [];
    failures.push({ type: 'serverFail', description });
    this.setFailures.set(operation, failures);
  }

  calls(operation: FastmailOperation) {
    return this.recordedCalls.filter((call) => call.operation === operation);
  }

  emailById(id: string) {
    const email = this.emails.get(id);
    return email ? structuredClone(email) : undefined;
  }

  allEmails() {
    return [...this.emails.values()].map((email) => structuredClone(email));
  }

  private async handleRoute(route: Route) {
    const request = route.request();
    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: this.corsHeaders() });
      return;
    }

    if (request.url().endsWith('/jmap/session')) {
      await this.handleSession(route, request);
      return;
    }

    if (request.url().endsWith('/jmap/api/')) {
      await this.handleJmap(route, request);
      return;
    }

    await route.abort('blockedbyclient');
  }

  private async handleSession(route: Route, request: Request) {
    const token = this.getToken(request);
    this.recordedCalls.push({ operation: 'session', token });
    await this.waitForDelay('session');

    const failure = this.takeFailure('session');
    if (failure || token !== 'valid-e2e-token') {
      await this.fulfillFailure(
        route,
        failure ?? { status: 401, body: 'Unauthorized' }
      );
      return;
    }

    await this.fulfillJson(route, {
      capabilities: {
        [coreCapability]: {},
        [maskedEmailCapability]: {}
      },
      state: 'e2e-session-state',
      apiUrl: 'https://api.fastmail.com/jmap/api/',
      accounts: {
        [accountId]: {
          name: 'e2e@fastmail.example',
          isPersonal: true,
          isReadOnly: false,
          userId: 'e2e-user',
          accountCapabilities: {
            [coreCapability]: {},
            [maskedEmailCapability]: {}
          }
        }
      },
      username: 'e2e@fastmail.example',
      primaryAccounts: {
        [coreCapability]: accountId,
        [maskedEmailCapability]: accountId
      }
    });
  }

  private async handleJmap(route: Route, request: Request) {
    const body = request.postDataJSON() as {
      using?: string[];
      methodCalls?: [string, Record<string, unknown>, string][];
    };
    const methodCall = body.methodCalls?.[0];
    if (!methodCall) throw new Error('JMAP request is missing methodCalls');

    const [method, arguments_, callId] = methodCall;
    const operation = this.getOperation(method, arguments_);
    const token = this.getToken(request);
    this.recordedCalls.push({ operation, body, token });
    await this.waitForDelay(operation);

    if (token !== 'valid-e2e-token') {
      await this.fulfillFailure(route, { status: 401, body: 'Unauthorized' });
      return;
    }
    if (
      !body.using?.includes(coreCapability) ||
      !body.using.includes(maskedEmailCapability)
    ) {
      throw new Error('JMAP request is missing required capabilities');
    }
    if (arguments_.accountId !== accountId) {
      throw new Error(`Unexpected JMAP account ID: ${arguments_.accountId}`);
    }

    const failure = this.takeFailure(operation);
    if (failure) {
      await this.fulfillFailure(route, failure);
      return;
    }

    if (operation === 'get') {
      await this.fulfillJson(route, {
        methodResponses: [
          [
            'MaskedEmail/get',
            {
              accountId,
              state: 'e2e-email-state',
              list: this.allEmails(),
              notFound: []
            },
            callId
          ]
        ],
        sessionState: 'e2e-session-state'
      });
      return;
    }

    const setFailure = this.takeSetFailure(operation);
    if (setFailure) {
      await this.fulfillJson(route, {
        methodResponses: [
          [
            'MaskedEmail/set',
            this.createSetFailureResponse(operation, arguments_, setFailure),
            callId
          ]
        ],
        sessionState: 'e2e-session-state'
      });
      return;
    }

    const response =
      operation === 'create'
        ? this.createEmail(arguments_)
        : operation === 'update'
          ? this.updateEmails(arguments_)
          : this.destroyEmails(arguments_);
    await this.fulfillJson(route, {
      methodResponses: [['MaskedEmail/set', response, callId]],
      sessionState: 'e2e-session-state'
    });
  }

  private createEmail(arguments_: Record<string, unknown>) {
    const create = arguments_.create as Record<
      string,
      Pick<MaskedEmail, 'description' | 'forDomain' | 'state'>
    >;
    const [creationId, options] = Object.entries(create)[0];
    this.createCounter += 1;
    const id = `created-${this.createCounter}`;
    const email = `created-${this.createCounter}@masked.example`;
    const createdEmail: E2EMaskedEmail = {
      id,
      email,
      state: options.state,
      description: options.description,
      forDomain: options.forDomain,
      url: null,
      createdAt: '2026-01-03T12:00:00Z',
      lastMessageAt: null,
      createdBy: 'E2E Test Suite'
    };
    this.emails.set(id, createdEmail);

    return {
      accountId,
      oldState: 'e2e-email-state',
      newState: 'e2e-email-state-2',
      created: {
        [creationId]: {
          id,
          email,
          url: null,
          createdAt: createdEmail.createdAt,
          lastMessageAt: null,
          createdBy: createdEmail.createdBy
        }
      }
    };
  }

  private updateEmails(arguments_: Record<string, unknown>) {
    const updates = arguments_.update as Record<
      string,
      Partial<Pick<MaskedEmail, 'description' | 'forDomain' | 'state'>>
    >;
    const updated: Record<string, null> = {};
    for (const [id, update] of Object.entries(updates)) {
      const email = this.emails.get(id);
      if (!email) continue;
      this.emails.set(id, { ...email, ...update });
      updated[id] = null;
    }
    return {
      accountId,
      oldState: 'e2e-email-state',
      newState: 'e2e-email-state-2',
      updated
    };
  }

  private destroyEmails(arguments_: Record<string, unknown>) {
    const ids = arguments_.destroy as string[];
    const destroyed = ids.filter((id) => this.emails.delete(id));
    return {
      accountId,
      oldState: 'e2e-email-state',
      newState: 'e2e-email-state-2',
      destroyed
    };
  }

  private getOperation(
    method: string,
    arguments_: Record<string, unknown>
  ): FastmailOperation {
    if (method === 'MaskedEmail/get') return 'get';
    if (method !== 'MaskedEmail/set') {
      throw new Error(`Unsupported JMAP method: ${method}`);
    }
    if (arguments_.create) return 'create';
    if (arguments_.update) return 'update';
    if (arguments_.destroy) return 'destroy';
    throw new Error('Unsupported MaskedEmail/set operation');
  }

  private getToken(request: Request) {
    const authorization = request.headers().authorization;
    return authorization?.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length)
      : null;
  }

  private takeFailure(operation: FastmailOperation) {
    const failures = this.failures.get(operation);
    return failures?.shift();
  }

  private async waitForDelay(operation: FastmailOperation) {
    const delays = this.delays.get(operation);
    const delay = delays?.shift();
    if (delay) await delay;
  }

  private takeSetFailure(operation: FastmailOperation) {
    const failures = this.setFailures.get(operation);
    return failures?.shift();
  }

  private createSetFailureResponse(
    operation: FastmailOperation,
    arguments_: Record<string, unknown>,
    failure: SetFailure
  ) {
    const failureKey =
      operation === 'create'
        ? 'notCreated'
        : operation === 'update'
          ? 'notUpdated'
          : 'notDestroyed';
    const ids =
      operation === 'destroy'
        ? (arguments_.destroy as string[])
        : Object.keys(arguments_[operation] as Record<string, unknown>);
    return {
      accountId,
      oldState: 'e2e-email-state',
      newState: 'e2e-email-state',
      [failureKey]: Object.fromEntries(ids.map((id) => [id, failure]))
    };
  }

  private async fulfillJson(route: Route, body: unknown) {
    await route.fulfill({
      status: 200,
      headers: this.corsHeaders(),
      contentType: 'application/json',
      body: JSON.stringify(body)
    });
  }

  private async fulfillFailure(route: Route, failure: Failure) {
    await route.fulfill({
      status: failure.status,
      headers: this.corsHeaders(),
      body: failure.body
    });
  }

  private corsHeaders() {
    return {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'authorization, content-type',
      'access-control-allow-methods': 'GET, POST, OPTIONS'
    };
  }
}
