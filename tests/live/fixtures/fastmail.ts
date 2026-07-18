const coreCapability = 'urn:ietf:params:jmap:core';
const maskedEmailCapability = 'https://www.fastmail.com/dev/maskedemail';

export interface LiveMaskedEmail {
  id: string;
  email: string;
  state: 'enabled' | 'disabled' | 'pending' | 'deleted';
  forDomain: string;
  description: string;
}

interface Session {
  apiUrl: string;
  primaryAccounts: Record<string, string>;
}

interface JmapResponse<T> {
  methodResponses: [string, T, string][];
}

// Keep verification independent from the client used by the extension so the
// test can detect client integration regressions and still clean up failures.
export class LiveFastmail {
  private constructor(
    private readonly token: string,
    private readonly apiUrl: string,
    private readonly accountId: string
  ) {}

  static async connect(token: string) {
    const response = await fetch('https://api.fastmail.com/jmap/session', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      throw new Error(`Fastmail session request failed: ${response.status}`);
    }

    const session = (await response.json()) as Session;
    const accountId = session.primaryAccounts[maskedEmailCapability];
    if (!session.apiUrl || !accountId) {
      throw new Error('Fastmail session is missing masked email access.');
    }
    return new LiveFastmail(token, session.apiUrl, accountId);
  }

  async getAllEmails() {
    const response = await this.call<{ list?: LiveMaskedEmail[] }>(
      'MaskedEmail/get',
      { accountId: this.accountId }
    );
    return response.list ?? [];
  }

  async updateEmail(
    id: string,
    update: Partial<
      Pick<LiveMaskedEmail, 'description' | 'forDomain' | 'state'>
    >
  ) {
    const response = await this.call<{
      notUpdated?: Record<string, { description?: string; type: string }>;
    }>('MaskedEmail/set', {
      accountId: this.accountId,
      update: { [id]: update }
    });
    const failure = response.notUpdated?.[id];
    if (failure) {
      throw new Error(
        `Fastmail update failed: ${failure.description ?? failure.type}`
      );
    }
  }

  async permanentlyDeleteEmail(id: string) {
    const response = await this.call<{
      notDestroyed?: Record<string, { description?: string; type: string }>;
    }>('MaskedEmail/set', {
      accountId: this.accountId,
      destroy: [id]
    });
    const failure = response.notDestroyed?.[id];
    if (failure) {
      throw new Error(
        `Fastmail deletion failed: ${failure.description ?? failure.type}`
      );
    }
  }

  private async call<T>(method: string, arguments_: Record<string, unknown>) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        using: [coreCapability, maskedEmailCapability],
        methodCalls: [[method, arguments_, 'live-test']]
      })
    });
    if (!response.ok) {
      throw new Error(`Fastmail JMAP request failed: ${response.status}`);
    }

    const body = (await response.json()) as JmapResponse<T>;
    const methodResponse = body.methodResponses?.[0];
    if (!methodResponse) throw new Error('Fastmail returned no JMAP response.');
    // JMAP method errors are returned inside successful HTTP responses.
    if (methodResponse[0] === 'error') {
      const error = methodResponse[1] as {
        description?: string;
        type?: string;
      };
      throw new Error(
        `Fastmail JMAP error: ${error.description ?? error.type ?? 'unknown'}`
      );
    }
    return methodResponse[1];
  }
}
