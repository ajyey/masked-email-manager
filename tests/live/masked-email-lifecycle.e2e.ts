import { expect, test } from './fixtures/test';
import { LiveFastmail, type LiveMaskedEmail } from './fixtures/fastmail';

const liveMarker = '[Masked Email Manager live test]';

async function findEmail(
  fastmail: LiveFastmail,
  predicate: (email: LiveMaskedEmail) => boolean
) {
  return (await fastmail.getAllEmails()).find(predicate);
}

async function removeEmail(fastmail: LiveFastmail, id: string) {
  const email = await findEmail(fastmail, (candidate) => candidate.id === id);
  if (!email) return;
  if (email.state !== 'deleted') {
    await fastmail.updateEmail(id, { state: 'deleted' });
  }
  await fastmail.permanentlyDeleteEmail(id);
}

async function removeStaleLiveEmails(fastmail: LiveFastmail) {
  const emails = await fastmail.getAllEmails();
  for (const email of emails) {
    if (email.description.startsWith(liveMarker)) {
      await removeEmail(fastmail, email.id);
    }
  }
}

test('manages a masked email against live Fastmail JMAP', async ({
  extension,
  popup,
  popupPage
}) => {
  const token = process.env.JMAP_TOKEN;
  if (!token) throw new Error('JMAP_TOKEN is required for live tests.');

  const runId = `${Date.now()}-${process.pid}`;
  const description = `${liveMarker} ${runId}`;
  const updatedDescription = `${description} updated`;
  const domain = `https://live-${runId}.invalid`;
  const updatedDomain = `https://updated-live-${runId}.invalid`;
  const fastmail = await LiveFastmail.connect(token);
  let createdId: string | undefined;

  await removeStaleLiveEmails(fastmail);

  try {
    await popupPage.login(token);
    await popupPage.expectHome();

    await popupPage.createEmail({ domain, description });
    await expect
      .poll(async () =>
        Boolean(
          await findEmail(
            fastmail,
            (email) => email.description === description
          )
        )
      )
      .toBe(true);

    const createdEmail = await findEmail(
      fastmail,
      (email) => email.description === description
    );
    if (!createdEmail) throw new Error('Unable to find the live test email.');
    createdId = createdEmail.id;

    await expect(
      popupPage.emailOption(createdEmail.email, 'enabled')
    ).toHaveAttribute('aria-selected', 'true');

    await popupPage.editSelectedEmail({
      domain: updatedDomain,
      description: updatedDescription
    });
    await expect
      .poll(async () => findEmail(fastmail, (email) => email.id === createdId))
      .toMatchObject({
        description: updatedDescription,
        forDomain: updatedDomain
      });

    await popupPage.setSelectedEmailEnabled(false);
    await expect
      .poll(
        async () =>
          (await findEmail(fastmail, (email) => email.id === createdId))?.state
      )
      .toBe('disabled');

    await popupPage.selectFilter('Disabled');
    await popupPage.selectEmail(createdEmail.email, 'disabled');
    await popupPage.setSelectedEmailEnabled(true);
    await expect
      .poll(
        async () =>
          (await findEmail(fastmail, (email) => email.id === createdId))?.state
      )
      .toBe('enabled');

    await popupPage.selectFilter('Enabled');
    await popupPage.selectEmail(createdEmail.email, 'enabled');
    await popupPage.favoriteSelectedEmail();
    await expect
      .poll(async () => (await extension.getStorage(popup)).favorite_emails)
      .toContain(createdId);

    await popupPage.softDeleteSelectedEmail();
    await expect
      .poll(
        async () =>
          (await findEmail(fastmail, (email) => email.id === createdId))?.state
      )
      .toBe('deleted');

    await popupPage.selectFilter('Deleted');
    await popupPage.selectEmail(createdEmail.email, 'deleted');
    await popupPage.permanentlyDeleteSelectedEmail();
    await expect
      .poll(async () => findEmail(fastmail, (email) => email.id === createdId))
      .toBeUndefined();
    createdId = undefined;

    await popupPage.logout();
    await popupPage.expectLogin();
  } finally {
    if (createdId) await removeEmail(fastmail, createdId);
  }
});
