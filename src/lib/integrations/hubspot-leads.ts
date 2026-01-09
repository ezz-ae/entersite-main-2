import { hubspot } from '@/lib/hubspot';
import { CAP } from '@/lib/capabilities';

type LeadInput = {
  email?: string;
  phone?: string;
  name?: string;
  message?: string;
  pageUrl?: string;
};

const splitName = (name?: string) => {
  if (!name) return { firstname: '', lastname: '' };
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstname: parts[0] || '', lastname: '' };
  return { firstname: parts[0], lastname: parts.slice(1).join(' ') };
};

export async function upsertHubspotLead(lead: LeadInput) {
  if (!CAP.hubspot || !hubspot || !lead.email) {
    return { skipped: true };
  }

  const client = hubspot;
  const { firstname, lastname } = splitName(lead.name);

  const contact = await client.crm.contacts.basicApi
    .create({
      properties: {
        email: lead.email,
        firstname,
        lastname,
        phone: lead.phone || '',
      },
    })
    .catch(async () => {
      const search = await client.crm.contacts.searchApi.doSearch({
        filterGroups: [
          {
            filters: [{ propertyName: 'email', operator: 'EQ' as any, value: lead.email! }],
          },
        ],
        properties: ['email'],
        limit: 1,
      });
      const id = search.results?.[0]?.id;
      if (!id) {
        throw new Error('HubSpot contact not found after create failed.');
      }
      await client.crm.contacts.basicApi.update(id, {
        properties: { phone: lead.phone || '' },
      });
      return { id };
    });

  const contactId = 'id' in contact ? contact.id : (contact as { id?: string }).id;

  if (lead.message && contactId) {
    await client.crm.objects.notes.basicApi
      .create({
        properties: {
          hs_note_body: `New lead from Entrestate\n\nMessage:\n${lead.message}\n\nPage:\n${
            lead.pageUrl || ''
          }`,
          hs_timestamp: new Date().toISOString(),
        },
        associations: [
          {
            to: { id: contactId },
            types: [
              {
                associationCategory: 'HUBSPOT_DEFINED' as any,
                associationTypeId: 202,
              },
            ],
          },
        ],
      })
      .catch(() => null);
  }

  return { ok: true, contactId };
}
